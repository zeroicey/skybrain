# SkyEye 视频语义检索解决方案（YOLO11 + CLIP + Prisma + NestJS + BullMQ）

## 1. 目标与范围

基于需求文档，系统需支持：

1. 用户上传视频并命名，后端异步处理，处理完成通知前端。
2. 用户可选择一个或多个已处理完成的视频作为检索范围。
3. 用户输入时间区间 + 自然语言特征，返回匹配画面（图片）与时间点。
4. 系统必须支持同一人判定：同视频跨秒与跨视频都要给出同人/不同人/不确定结论。

本方案聚焦后端与数据层实现，前端仅定义交互契约。

## 2. 现有粗略方案合理性审查

## 合理点

1. YOLO + CLIP 两阶段设计方向正确：检测负责定位，CLIP 负责语义对齐。
2. MinIO 存储视频与帧文件可行，且与现有项目技术栈一致。
3. pgvector 做相似度检索可满足自然语言检索需求。

## 需要修正或补全的点

1. 原方案未覆盖任务生命周期与失败恢复。
说明：仅写“异步处理”不够，需要可追踪状态、错误原因、重试策略。

2. 原数据模型过于抽象，缺少可落地字段与索引。
说明：需要时间戳毫秒、唯一约束、联合索引、检测框字段拆分、处理状态字段。

3. 原方案使用 YOLOv8，不符合本次要求。
说明：需要替换为 YOLO11（Ultralytics 最新代际命名）。

4. 原方案虽然提到队列，但缺少 BullMQ 工程化细节。
说明：需要明确生产级队列落地方案，包括重试、幂等、并发控制、状态同步、失败补偿。

5. 原方案未说明 Prisma 与 pgvector 的落地方式。
说明：Prisma 目前对 vector 类型采用 Unsupported("vector(512)") + SQL migration。

结论：原方案方向正确，但工程可执行性不足。以下提供可直接开发的详细版本。

## 3. 目标架构

```text
上传视频 -> MinIO(original)
         -> 创建 DB 记录(video=UPLOADED)
         -> 投递 BullMQ job

processVideo:
  0) BullMQ Worker 领取 job 后，将 video.status 更新为 PROCESSING
  1) ffprobe 获取元数据
  2) ffmpeg 抽帧
  3) YOLO11 检测 (对象与框)
  4) MOT 跟踪（ByteTrack/BoT-SORT）生成 person track
  5) ReID 向量化（按 track 聚合）
  6) CLIP 向量化（帧 + 对象裁剪）
  7) 写入 PostgreSQL(pgvector)
  8) 更新 video=READY
  9) WebSocket 通知前端

搜索:
  文本 -> CLIP 文本向量 -> pgvector 相似度查询
      -> 时间范围过滤 + 视频范围过滤 + 可选检测类别过滤
      -> 返回帧图片 URL + timestamp
```

## 4. 数据库设计

数据库设计已单独拆分，详见 [database-design.md](database-design.md)。

本节只保留关键说明：

1. 主流程表：Video、VideoProcessJob、Frame、FrameDetection。
2. 同人必选表：PersonTrack、PersonIdentity、PersonEmbedding、PersonIdentityMatch、PersonReviewTask。
3. 向量表：FrameEmbedding、DetectionEmbedding、PersonEmbedding（pgvector）。
4. 迁移方式：Prisma Schema + SQL migration（启用 vector extension 与 HNSW 索引）。

## 5. NestJS + BullMQ 任务方案

## 5.1 队列组件与配置

推荐组件：

1. `@nestjs/bullmq`
2. `bullmq`
3. `ioredis`

建议队列：

1. `skyeye-video-process`：视频处理主队列。
2. `skyeye-video-events`（可选）：处理状态事件分发。

## 5.2 触发方式（入队，不阻塞 HTTP）

上传成功后创建可追踪任务记录，再投递 BullMQ job：

```ts
// VideosService.createUpload(...)
const video = await this.videoRepo.createUploaded(...);
const queueJobId = `video:${video.id}`;

await this.videoJobRepo.createPending({
  videoId: video.id,
  queueName: 'skyeye-video-process',
  queueJobId,
});

await this.videoProcessQueue.add(
  'process-video',
  { videoId: video.id },
  {
    jobId: queueJobId,
    attempts: 3,
    backoff: { type: 'exponential', delay: 15000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
);

return { videoId: video.id, status: video.status };
```

说明：

1. `attempt` 字段记录已执行次数，首次入队为 `0`，Worker 开始执行后递增。
2. `removeOnComplete/removeOnFail` 的保留数应覆盖你的对账窗口。

## 5.3 Worker 消费与状态同步

```ts
@Processor('skyeye-video-process')
export class VideoProcessConsumer extends WorkerHost {
  async process(job: Job<{ videoId: string }>): Promise<void> {
    await this.videoLifecycleService.markProcessing(job.data.videoId, job.id!);
    await this.videoPipelineService.processVideo(job.data.videoId);
    await this.videoLifecycleService.markReady(job.data.videoId, job.id!);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<{ videoId: string }>, error: Error): Promise<void> {
    const maxAttempts = job.opts.attempts ?? 1;
    const isFinalFailure = job.attemptsMade >= maxAttempts;

    if (isFinalFailure) {
      await this.videoLifecycleService.markFailed(job.data.videoId, job.id!, error);
      return;
    }

    await this.videoLifecycleService.markRetrying(job.data.videoId, job.id!, {
      attemptsMade: job.attemptsMade,
      maxAttempts,
      error,
    });
  }
}
```

## 5.4 幂等、并发、重试

1. 幂等：`jobId` 使用 `video:${videoId}`，避免重复入队。
2. 并发：在 Worker 配置 `concurrency=2~4`，按机器资源调优。
3. 重试：使用 BullMQ `attempts + exponential backoff`，失败后自动重投。
4. 最终失败判定：仅当 `attempts` 用尽，才将 `videos.status` 写为 `FAILED`。
5. 状态分层：视频业务状态在 `videos`；执行态与审计在 `video_process_jobs`。

## 5.5 补偿与恢复

1. 服务启动时对账：扫描 `videos.status=PROCESSING` 且长时间无更新的数据。
2. 对账后根据 BullMQ job 实际状态修正 DB（继续等待、重试或标记失败）。
3. 若 Redis 中 job 已被清理，则使用 `video_process_jobs` + `videos.updatedAt` 做兜底判定，并转人工复核或重投。
4. 使用 `QueueEvents` 监听 `completed/failed/stalled`，保证数据库与队列状态一致。

建议补充事件：

1. `active`：写入 PROCESSING 心跳。
2. `failed`（非最终）：写入 `video_process_jobs.status=RETRYING`，不改 `videos` 终态。
3. `failed`（最终）：写入 FAILED 终态。

## 5.6 为什么使用 BullMQ

1. 原生支持重试、退避、并发、延迟与失败事件。
2. 多实例部署下稳定性优于普通内存异步任务。
3. 与 NestJS 集成成熟，后续可平滑扩展优先级队列与独立 Worker 节点。

## 6. 视频处理流水线实现细节

## 6.1 上传阶段

1. 前端上传视频文件 + 视频名称。
2. 后端保存到 MinIO：`skyeye/videos/{videoId}/original.mp4`。
3. DB 创建 `videos` 记录，状态 `UPLOADED`。
4. 立即返回 `videoId` 给前端。

## 6.2 元数据与抽帧

1. 用 `ffprobe` 获取时长、分辨率、编码信息，更新 `durationMs`。
2. 默认策略：`fps=1`；可配置为场景抽帧。
3. 抽帧文件写入临时目录，再上传 MinIO：
   `skyeye/videos/{videoId}/frames/{frameNo}.jpg`。
4. 每帧写入 `frames` 表（含 `timestampMs`、`frameNo`、尺寸）。

示例命令：

```bash
# 固定采样：每秒 1 帧
ffmpeg -i input.mp4 -vf "fps=1" /tmp/frames/frame_%06d.jpg

# 场景变化采样（可选）
ffmpeg -i input.mp4 -vf "select='gt(scene,0.30)',showinfo" -vsync vfr /tmp/frames/frame_%06d.jpg
```

## 6.3 YOLO11 检测

建议将 YOLO11 推理封装为独立 Python 推理服务，NestJS 通过 HTTP/gRPC 调用。

输入契约固定为“预签名 URL”，避免容器间本地路径不可见问题。

`model` 与 `conf` 为可配置输入，但必须做白名单与范围校验：

1. `model` 仅允许 `yolo11n.pt | yolo11s.pt | yolo11m.pt`。
2. `conf` 允许范围 `[0.05, 0.95]`，默认 `0.25`。

```python
from ultralytics import YOLO

model_name = payload.get("model", "yolo11n.pt")
conf = float(payload.get("conf", 0.25))

model = YOLO(model_name)
results = model.predict(source=image_url, conf=conf)

for result in results:
    for box in result.boxes:
        class_id = int(box.cls[0])
        confidence = float(box.conf[0])
        x1, y1, x2, y2 = box.xyxy[0].tolist()
```

校验伪代码：

```python
allowed_models = {"yolo11n.pt", "yolo11s.pt", "yolo11m.pt"}
if model_name not in allowed_models:
    raise ValueError("unsupported model")

if conf < 0.05 or conf > 0.95:
    raise ValueError("conf out of range")
```

请求示例：

```json
{
  "imageUrl": "https://minio/.../frame_000123.jpg?X-Amz-Signature=...",
  "conf": 0.25,
  "model": "yolo11n.pt"
}
```

写入 `frame_detections`，并可对检测框进行裁剪生成目标图（用于对象级 embedding）。

## 6.4 同一人判定主链路（必选）

同一人识别是必选能力，不是可选增强。

在线处理链路：

1. YOLO11 产出 person 检测框。
2. MOT 跟踪将连续帧检测框关联成轨迹（track）。
3. ReID 模型提取每个框的外观向量，聚合为轨迹向量。
4. 对每个新轨迹执行身份匹配：
  - 先按时空先验过滤候选身份。
  - 再做向量余弦相似度 TopK 检索。
  - 用融合分数决策：同人 / 不同人 / 不确定。
5. 不确定结果写入复核队列，支持人工确认回流。

复核状态建议：

1. `PENDING_REVIEW`
2. `IN_REVIEW`
3. `RESOLVED_MATCH`
4. `RESOLVED_REJECT`

判定分数建议：

$$
S = w_e \cdot \cos(e_a, e_b) + w_c \cdot C_{color} + w_t \cdot C_{spacetime}
$$

其中：

1. $e_a, e_b$ 是两条轨迹的 ReID 向量。
2. $C_{color}$ 是服饰颜色一致性分数。
3. $C_{spacetime}$ 是时空约束分数（如相邻摄像头、可达时间窗，数据来自 `Video.cameraId`）。

阈值策略建议：

1. `S >= T_high`：自动判定同一人。
2. `S <= T_low`：自动判定不同人。
3. `T_low < S < T_high`：标记 `NEEDS_REVIEW`。

首发默认策略（必须固化并版本化）：

1. `policyVersion = reid-v1.0`
2. `reidModel = osnet_x1_0`
3. `w_e = 0.78`, `w_c = 0.12`, `w_t = 0.10`
4. `T_high = 0.82`, `T_low = 0.65`
5. 候选召回 `TopK = 50`

所有判定结果都应返回 `policyVersion`，便于线上审计与回放。

## 6.5 CLIP 向量化

1. 帧级 embedding：每帧 1 个向量。
2. 目标级 embedding（可选但推荐）：每个检测框 1 个向量。
3. 搜索文本也使用同一 CLIP 模型编码，确保同向量空间可比较。

中文检索建议：

1. 优先选多语言图文模型（如多语言 CLIP 变体）或在现有 CLIP 前增加中文归一化/翻译层。
2. 离线评测后再定型：至少统计 `Recall@10`、`Recall@20`，再决定是否保留英文 CLIP。
3. 将“中文 query 召回率阈值”写入验收标准，避免上线后语义不准。

```python
import torch
from transformers import CLIPModel, CLIPProcessor

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def encode_image(image):
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        return model.get_image_features(**inputs)

def encode_text(text):
    inputs = processor(text=text, return_tensors="pt")
    with torch.no_grad():
        return model.get_text_features(**inputs)
```

## 6.6 完成通知

处理成功：更新 `videos.status = READY`，并推送 WebSocket 事件：

```json
{
  "event": "video.processing.completed",
  "videoId": "...",
  "status": "READY",
  "processedAt": "2026-04-18T10:00:00.000Z"
}
```

失败时推送 `video.processing.failed`，携带错误摘要。

## 7. 搜索实现细节

## 7.1 搜索请求结构

```json
{
  "videoIds": ["uuid-1", "uuid-2"],
  "startMs": 0,
  "endMs": 120000,
  "query": "穿白色衣服的人",
  "classNames": ["person"],
  "topK": 20,
  "minConfidence": 0.25,
  "cursor": {
    "lastDistance": 0.2031,
    "lastFrameId": "f6a4ec96-7b7e-4b7b-83e2-a87f0f6df777"
  }
}
```

## 7.2 检索 SQL（核心）

说明：向量检索建议使用 `prisma.$queryRaw`。

```sql
WITH ranked AS (
  SELECT
    f.id,
    f.video_id,
    f.timestamp_ms,
    f.object_key,
    (fe.embedding <=> $1::vector) AS distance
  FROM frame_embeddings fe
  JOIN frames f ON f.id = fe.frame_id
  JOIN videos v ON v.id = f.video_id
  WHERE f.video_id = ANY($2::uuid[])
    AND f.timestamp_ms BETWEEN $3 AND $4
    AND v.status = 'READY'
), candidates AS (
  SELECT *
  FROM ranked
  WHERE (
    $7::double precision IS NULL
    OR distance > $7::double precision
    OR (distance = $7::double precision AND id > $8::uuid)
  )
  ORDER BY distance ASC, id ASC
  LIMIT $5
)
SELECT c.id, c.video_id, c.timestamp_ms, c.object_key, c.distance
FROM candidates c
WHERE (
  $6::numeric IS NULL OR EXISTS (
    SELECT 1
    FROM frame_detections d
    WHERE d.frame_id = c.id
      AND d.confidence >= $6::numeric
  )
)
ORDER BY c.distance ASC, c.id ASC;
```

说明：

1. `minConfidence` 在该 SQL 中已真实生效，不再是无效参数。
2. 若需要“人/车”类别约束，可在 `EXISTS` 子句中增加 `d.class_name = ANY($classNames::text[])`。
3. `cursor` 由上一页最后一条结果的 `(distance, id)` 构成，保证翻页稳定且不重复。
4. 若 `minConfidence` 过滤后结果不足 `topK`，建议向量召回先做过采样（例如 `LIMIT topK * 3`），再过滤并截断到 `topK`。
5. 生产上建议使用“向量召回 + 条件重排”两阶段，并用 `EXPLAIN ANALYZE` 固化基线。

## 7.3 返回结果

返回字段建议包括：

1. `videoId`
2. `frameId`
3. `timestampMs`
4. `imageUrl`（MinIO 预签名 URL）
5. `score`（可由 `1 - distance` 归一）
6. `nextCursor`（用于继续翻页直到拿到全部匹配）

`nextCursor` 生成规则：取当前页最后一行的 `(distance, frameId)`。

## 8. API 设计（NestJS）

1. `POST /skyeye/videos`
作用：上传视频并创建处理任务（BullMQ 入队触发）。

2. `GET /skyeye/videos?status=READY&page=1&limit=20`
作用：查询可检索视频列表。

3. `GET /skyeye/videos/:id`
作用：查询单视频处理状态与失败原因。

4. `POST /skyeye/search`
作用：执行语义检索，分页返回匹配帧。

5. `GET /skyeye/events/ws`（WebSocket）
作用：订阅处理状态变化通知。

6. `POST /skyeye/person/verify`
作用：输入两个时刻（或两个 detectionId），返回同人判定结果与置信度。

请求建议：

```json
{
  "left": {
    "videoId": "uuid-left",
    "detectionId": 12345,
    "timestampMs": 10000
  },
  "right": {
    "videoId": "uuid-right",
    "detectionId": 67890,
    "timestampMs": 22000
  },
  "cameraIdLeft": "cam-a",
  "cameraIdRight": "cam-b"
}
```

请求规则（必须）：

1. `left` 与 `right` 必须至少提供一组唯一定位：
   - `detectionId`，或
   - `videoId + timestampMs + personIndex`。
2. 若同一时刻多人且未给 `personIndex`，返回 `MULTIPLE_PERSONS_AT_TIMESTAMP`。

响应建议：

```json
{
  "samePerson": true,
  "decision": "AUTO_MATCH",
  "finalScore": 0.8732,
  "cosineSimilarity": 0.9111,
  "policyVersion": "reid-v1.0",
  "identityIdLeft": "person-identity-uuid",
  "identityIdRight": "person-identity-uuid"
}
```

响应规则（必须）：

1. `decision=NEEDS_REVIEW` 时，`samePerson` 返回 `null`。
2. `AUTO_MATCH` 返回 `true`，`AUTO_REJECT` 返回 `false`。

7. `GET /skyeye/person-identities/:identityId/appearances`
作用：查询该身份在各视频中的出现记录与时间区间。

## 9. 错误处理与可观测性

1. 状态机必须单向可追踪：`UPLOADED -> PROCESSING -> READY/FAILED -> ARCHIVED（可选归档态）`。
2. 失败记录 `failureReason` + `video_process_jobs.errorCode/errorStack`。
3. 使用结构化日志记录每阶段耗时（抽帧、检测、向量化、入库）。
4. 对外错误码建议：
  - `VIDEO_NOT_READY`
  - `VIDEO_PROCESSING_FAILED`
  - `INVALID_TIME_RANGE`
  - `EMPTY_SEARCH_SCOPE`
  - `IDENTITY_NOT_ENOUGH_EVIDENCE`
  - `IDENTITY_NEEDS_REVIEW`
  - `IDENTITY_MODEL_UNAVAILABLE`
  - `MULTIPLE_PERSONS_AT_TIMESTAMP`
  - `NO_PERSON_FOUND`
  - `INVALID_VERIFY_REQUEST`

## 10. 非功能要求建议

1. 性能目标（初版）：
   - 10 分钟视频处理耗时 P95 <= 6 分钟（单机 1x T4 + 8 vCPU + 16GB RAM）。
   - 检索接口 P95 < 1500ms（TopK=20，范围视频 <= 20）。
   - 每次发版前对核心检索 SQL 执行 `EXPLAIN ANALYZE`，确认执行计划与耗时未劣化。
   - 同人判定接口 `POST /skyeye/person/verify` 的 P95 < 1000ms（候选身份 <= 5000）。

2. 识别质量目标（必测）：
   - 单视频跨秒同人识别：`IDF1 >= 0.80`。
   - 跨视频同人识别：`mAP >= 0.70`、`Recall@10 >= 0.85`。
   - 不确定样本占比控制在可运营范围（建议 < 15%）。

3. 资源治理：
   - 限制单文件大小、时长上限。
   - 临时文件处理后立即清理。

4. 安全：
   - 上传接口做类型与大小校验。
   - MinIO 访问通过服务端签名 URL。

## 11. 与需求逐条对齐

1. 上传与处理：已支持上传命名、异步处理、完成通知。
2. 选择检索范围：支持多视频 `videoIds` 联合检索。
3. 执行检索：支持时间区间 + 自然语言输入，分页返回匹配画面，客户端可翻页获取全部结果。
4. 同一人判定：支持跨秒与跨视频同人识别，输出同人/不同人/不确定与置信度。

## 12. 同一人判定说明（第 a 秒与第 b 秒 / 跨视频）

系统如何判断“是不是同一个人”：

1. 先把每一秒的人框通过 MOT 串成轨迹，轨迹内默认是同一人连续观测。
2. 对轨迹提取 ReID 向量并聚合，得到身份特征表示。
3. 跨秒比较：直接比较对应轨迹向量相似度，并结合时空连续性。
4. 跨视频比较：在身份库中做向量检索，匹配最高分身份，再做阈值决策。
5. 若证据不足，返回“不确定”，进入复核队列，而不是强行给错误结论。

这意味着系统输出不是“绝对真值”，而是“概率化判定 + 业务阈值决策”。

---

## 13. 实施建议（分阶段）

1. Phase 1：完成主链路闭环（检测 + 跟踪 + ReID + 身份匹配 + 语义检索）。
2. Phase 2：引入人工复核与在线阈值调优，降低误判和漏判。
3. Phase 3：扩展评估数据集、做摄像头域自适应与模型蒸馏优化。