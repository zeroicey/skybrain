# SkyEye 路线图 A：用户上传视频与异步处理主线（NestJS + BullMQ + PostgreSQL + MinIO + Python）

## 1. 目标

该主线解决“用户上传视频后如何稳定处理到可检索状态”的全流程问题，覆盖：

1. HTTP 上传受理。
2. MinIO 原视频落盘。
3. PostgreSQL 状态与审计入库。
4. BullMQ 异步编排。
5. Python 推理链（ffprobe、ffmpeg、YOLO11、MOT/ReID、CLIP）。
6. 处理完成/失败通知回传前端。

最终成功标准：

1. `videos.status = READY`。
2. `video_process_jobs.status = SUCCEEDED`。
3. 帧、检测、向量、同人相关数据可用于检索与同人判定。
4. 前端收到完成事件并可立即查询结果。

## 2. 参与组件与职责

1. NestJS API：接收上传请求、写业务记录、投递队列、提供状态查询接口。
2. MinIO：存储原视频与抽帧图片。
3. BullMQ（Redis）：异步任务调度、重试、失败恢复事件。
4. NestJS Worker：执行处理编排，维护状态机和审计。
5. Python 推理服务：执行 ffprobe/ffmpeg/YOLO11/ReID/CLIP。
6. PostgreSQL + Prisma + pgvector：保存结构化数据与向量。
7. WebSocket Gateway：推送处理进度、成功、失败事件。

## 3. 全局变量与命名约定

## 3.1 请求输入变量（NestJS API）

1. `inUserId: number` 上传用户 ID。
2. `inVideoName: string` 视频名称。
3. `inFile: MultipartFile` 上传文件。
4. `inContentType: string` 媒体类型。
5. `inFileSizeBytes: number` 文件大小。
6. `inChecksum: string | null` 可选文件校验值。
7. `inForceReprocess: boolean` 是否强制重处理（默认 `false`）。

## 3.2 系统生成变量

1. `videoId: string(uuid)` 视频主键。
2. `processRunNo: number` 处理运行序号（首跑为 `1`，重处理递增）。
3. `queueJobId: string` 固定为 `video:{videoId}:run:{processRunNo}`，用于队列唯一标识。
4. `originalObjectKey: string` 例如 `skyeye/videos/{videoId}/original.mp4`。
5. `requestId: string` 每次请求链路追踪。
6. `traceId: string` 跨服务调用追踪。

## 3.3 处理过程变量（Worker）

1. `probeMeta`：ffprobe 元数据。
2. `frameBatch[]`：抽帧后的帧元信息集合。
3. `detectionBatch[]`：YOLO11 检测结果集合。
4. `trackBatch[]`：MOT 生成的人体轨迹集合。
5. `reidEmbeddingBatch[]`：轨迹 ReID 向量集合。
6. `clipFrameEmbeddingBatch[]`：帧级 CLIP 向量集合。
7. `clipDetectionEmbeddingBatch[]`：框级 CLIP 向量集合。
8. `failureCtx`：错误上下文（code、stack、stage、attempt）。

## 3.4 对外返回变量

1. `outVideoId`
2. `outJobId`
3. `outStatus`
4. `outRequestId`
5. `outErrorCode`（失败时）

## 3.5 新增持久化字段与表（必须通过 migration 落地）

1. `videos.content_checksum`：用于业务幂等判定。
2. `videos.file_size_bytes`：与 checksum 共同参与去重。
3. `video_upload_idempotency`：上传幂等锁表，建议字段：
   - `dedup_key`（唯一键，建议 `sha256(userId:checksum:fileSize)`）
   - `video_id`（可空；`CLAIMED` 阶段可为空，`BOUND` 阶段必须绑定）
   - `status(CLAIMED|BOUND|RELEASED|EXPIRED)`
   - `lease_expires_at`
   - `created_by`
   - `created_at/updated_at`
4. `video_process_jobs.run_no`：处理运行序号，建议约束 `UNIQUE(video_id, run_no)`。
5. `video_queue_outbox`：队列投递外盒表，建议字段：
   - `id`
   - `video_id`
   - `run_no`
   - `queue_name`
   - `queue_job_id`
   - `payload_json`
   - `status(NEW|DISPATCHING|SENT|FAILED)`
   - `attempt`
   - `next_retry_at`
   - `last_error`
   - `created_at/updated_at`

## 4. 状态机与迁移规则

视频状态机：

1. `UPLOADED -> PROCESSING -> READY`
2. `UPLOADED -> PROCESSING -> FAILED`
3. `FAILED -> PROCESSING -> READY/FAILED`（仅 `inForceReprocess=true` 且使用新 `run_no`）
4. `READY/FAILED -> ARCHIVED`（可选归档）

任务状态机：

1. `PENDING -> RUNNING -> SUCCEEDED`
2. `PENDING/RUNNING -> RETRYING -> RUNNING`
3. `RUNNING/RETRYING -> FAILED`（仅最终失败）
4. `PENDING -> FAILED`（仅 outbox 入队超过重试上限，`error_code=QUEUE_ENQUEUE_FAILED`）

迁移守卫：

1. 非最终失败禁止将 `videos.status` 写成 `FAILED`。
2. `READY` 之后禁止回写为 `PROCESSING`。
3. `queueJobId` 必须全局唯一，且每次重处理必须生成新的 `run_no + queueJobId`。

## 4.1 事务边界（必须）

1. `T1`（上传落库事务）：`U2` 与 `U3` 只写数据库（`videos + video_process_jobs + video_queue_outbox`）并同事务提交；`video_upload_idempotency` 的 `video_id` 绑定与 `status=BOUND` 更新也必须纳入该事务。
2. `T2`（处理阶段事务）：`U7~U10` 采用“阶段事务 + 阶段检查点”模式，每阶段失败只回滚本阶段。
3. `T3`（成功收尾事务）：`U11` 中 `videos` 与 `video_process_jobs` 必须原子提交。
4. `T4`（最终失败事务）：`U12` 最终失败分支中 `videos` 与 `video_process_jobs` 必须原子提交。

## 4.2 重试幂等总则（必须）

1. 所有可重试阶段都必须定义“冲突处理策略”或“重跑前清理策略”，禁止裸插入。
2. 同一个 `videoId` 在重试时只能保留一套有效处理产物。
3. 重试引发的重复写入必须可恢复，不能因唯一键冲突导致永久失败。

## 4.3 一致性模型与补偿 SLA（必须）

1. 上传链路明确采用“数据库强一致 + 队列最终一致”模型，不宣称跨 DB 与 BullMQ 原子提交。
2. Outbox Dispatcher 轮询频率：默认每 `5s`。
3. `NEW/FAILED` outbox 记录入队延迟目标：`P95 <= 10s`。
4. 悬挂记录修复任务频率：默认每 `30s`，最大修复延迟目标 `<= 60s`。
5. 超过 `60s` 未入队的记录必须进入告警，并自动执行重投或失败落态。
6. 幂等 claim 租约必须覆盖上传耗时：`leaseDuration >= maxUploadSLA + 2min`，并在 U1 上传期间持续续期心跳（默认每 `30s`）。

## 5. 主线步骤（逐步变量传递与数据库更新）

## U0. API 入站校验

1. 输入：`inFile`、`inVideoName`、`inContentType`、`inFileSizeBytes`。
2. 处理：校验大小、时长上限策略、媒体类型白名单。
3. 数据库：无写入。
4. 输出：`validatedUploadInput`。
5. 失败返回：`INVALID_UPLOAD_FILE` / `UNSUPPORTED_MEDIA_TYPE`。

## U0.1 业务幂等判定（必须）

1. 输入：`inUserId`、`inChecksum`、`inFileSizeBytes`、`inForceReprocess`。
2. 处理：
   - 若 `inChecksum` 为空，服务端计算 `sha256`。
   - 计算 `dedupKey = sha256(userId:checksum:fileSizeBytes)`。
   - 使用 `video_upload_idempotency` 执行原子 claim：`insert ... on conflict do nothing`。
   - claim 成功后写入 `status=CLAIMED` 与租约（`lease_expires_at = now() + leaseDuration`）。
   - claim 失败时读取已存在 `videoId`，避免并发双写。
3. 判定策略：
   - 命中 `READY`：直接返回已有 `videoId/jobId/status`（不新建）。
   - 命中 `UPLOADED/PROCESSING` 且 `inForceReprocess=false`：直接返回已有 `videoId/jobId/status`（不新建）。
   - 命中 `UPLOADED/PROCESSING` 且 `inForceReprocess=true`：拒绝新建重处理（返回冲突/提示进行中）。
   - 命中 `FAILED` 且 `inForceReprocess=true`：复用原 `videoId`，并分配新 `processRunNo` 重新投递。
   - 其余情况：继续新建流程。
4. 输出：`idempotencyDecision`（含 `videoId/processRunNo`）。

## U1. 原视频写入 MinIO

1. 输入：`validatedUploadInput`、`videoId`、`originalObjectKey`。
2. 处理：上传原视频到 MinIO，返回 `etag`。
   - 上传进行中每 `30s` 续期一次 `video_upload_idempotency.lease_expires_at`。
3. 数据库：无写入（先存储后建记录，避免 DB 指向不存在对象）。
4. 输出：`minioUploadResult { originalObjectKey, etag }`。
5. 失败返回：`OBJECT_STORAGE_WRITE_FAILED`。
6. 失败补偿（必须）：
   - 若当前请求持有幂等 claim，需将 `video_upload_idempotency.status` 置为 `RELEASED`（或缩短租约立即过期），防止 dedup_key 僵死。

## U2. 创建 Video 业务记录

1. 输入：`videoId`、`inVideoName`、`originalObjectKey`、`inUserId`。
2. 处理：写入 `videos`。
3. 数据库写入：
    - 表：`videos`
    - 字段：
       - `id = videoId`
       - `name = inVideoName`
       - `original_object_key = originalObjectKey`
       - `status = UPLOADED`
       - `created_by = inUserId`
       - `content_checksum = inChecksum`
       - `file_size_bytes = inFileSizeBytes`
       - `fps = 1`（默认）
       - `created_at/updated_at` 自动
4. 输出：`videoRecord`。
5. 失败处理：记录日志并触发对象清理补偿。
6. 成功后更新：`video_upload_idempotency.video_id = videoId` 且 `status = BOUND`。
7. 失败补偿（必须）：若 U2 失败，必须执行 claim 释放（`RELEASED/EXPIRED`），不能仅依赖租约自然过期。

## U3. 创建任务审计与 Outbox 记录

1. 输入：`videoId`、`processRunNo`、`queueJobId`。
2. 处理：在同一数据库事务中写 `video_process_jobs` 与 `video_queue_outbox`，不在该事务内直接调用 BullMQ。
3. 数据库写入：
   - 表：`video_process_jobs`
   - 字段：
     - `video_id = videoId`
     - `queue_name = skyeye-video-process`
     - `queue_job_id = queueJobId`
   - `run_no = processRunNo`
     - `status = PENDING`
     - `attempt = 0`
     - `max_attempts = 3`
   - 表：`video_queue_outbox`
   - 字段：
     - `video_id = videoId`
   - `run_no = processRunNo`
     - `queue_name = skyeye-video-process`
     - `queue_job_id = queueJobId`
     - `payload_json = { videoId }`
     - `status = NEW`
     - `attempt = 0`
5. 输出：`enqueueResult`。
6. 失败处理：
   - 若事务提交失败，整体回滚。
   - 若 outbox 后续派发失败，不修改 `videos` 终态，交由补偿任务重试。
7. 失败补偿（必须）：若 U3 失败且 claim 仍在 `CLAIMED/BOUND`，必须立即释放或缩租。

## U3.1 Outbox Dispatcher 入队（异步）

1. 触发：定时轮询 `video_queue_outbox.status IN (NEW, FAILED)` 且到达 `next_retry_at`。
2. 处理：调用 BullMQ `add('process-video', { videoId }, { jobId: queueJobId, attempts: 3, backoff: exponential(15000ms) })`。
3. 成功更新：
   - `video_queue_outbox.status = SENT`
   - `video_queue_outbox.attempt += 1`
4. 失败更新：
   - `video_queue_outbox.status = FAILED`
   - `video_queue_outbox.last_error = error`
   - `video_queue_outbox.next_retry_at = now() + backoff`
5. 超过重试上限：
   - `video_process_jobs.status = FAILED`
   - `video_process_jobs.error_code = QUEUE_ENQUEUE_FAILED`
   - `videos.status = FAILED`
   - `videos.failure_reason = QUEUE_ENQUEUE_FAILED`

## U4. 同步响应上传接口

1. 返回给前端：
   - `videoId`
   - `jobId = queueJobId`
   - `runNo = processRunNo`
   - `status = UPLOADED`
   - `requestId`
2. 语义：仅代表“已受理并持久化到 outbox”，不代表已被 Worker 消费。

## U5. Worker active 事件：进入 PROCESSING

1. 触发：BullMQ `active`。
2. 输入：`job.data.videoId`、`job.id`、`job.attemptsMade`。
3. 数据库更新：
   - 表：`videos`
   - `status = PROCESSING`（仅当当前状态为 `UPLOADED/PROCESSING`，或为 `FAILED` 且本次 `queue_job_id` 对应新 `run_no`；若已 `READY` 则拒绝回写并告警）
     - `processing_started_at = now()`（首次）
   - 表：`video_process_jobs`
       - `status = RUNNING`（按 `queue_job_id = job.id` 精确命中单行）
     - `attempt = job.attemptsMade + 1`
     - `started_at`（首次）
     - `heartbeat_at = now()`
4. 输出：`processingCtx`。
5. WebSocket：可推送 `video.processing.started`。
6. 一致性说明：若 `U3.1` 延迟，`U5` 会晚到，但不会丢失。

## U6. ffprobe 元数据提取

1. 输入：`originalObjectKey`。
2. Python 处理：执行 ffprobe 获取 `durationMs`、分辨率、帧率信息。
3. 数据库更新：
   - 表：`videos`
   - 字段：`duration_ms`、`updated_at`
4. 输出：`probeMeta`。
5. 失败：进入失败分支（见 U11/U12）。

## U7. ffmpeg 抽帧与 Frame 入库

1. 输入：`probeMeta`、`videoId`、抽帧策略（默认 FPS=1）。
2. Python 处理：抽帧并上传到 MinIO。
3. 数据库写入：
   - 表：`frames`（批量）
   - 字段：
     - `id`
     - `video_id = videoId`
     - `object_key`
     - `frame_no`
     - `timestamp_ms`
     - `width/height`
     - `source_type`
4. 输出：`frameBatch[]`。
5. 约束：`(video_id, timestamp_ms)` 唯一。
6. 幂等策略：
   - `attempt = 1`：直接批量插入。
   - `attempt > 1`：先执行按 `videoId` 的阶段清理（`frames` 及其级联依赖），再重建。
   - 若采用 UPSERT：以 `(video_id, timestamp_ms)` 为冲突键，执行更新而非报错。

## U8. YOLO11 检测与 FrameDetection 入库

1. 输入：`frameBatch[]`、`modelName`、`confThreshold`。
2. Python 处理：YOLO11 检测出 bbox 和类别。
3. 数据库写入：
   - 表：`frame_detections`（批量）
   - 字段：
     - `frame_id`
     - `class_id`
     - `class_name`
     - `confidence`
     - `x1,y1,x2,y2`
     - `source = YOLO11`
4. 输出：`detectionBatch[]`。
5. 失败：进入失败分支。
6. 幂等策略：
   - 若 `U7` 已执行重试清理，可直接批量插入。
   - 若无重试清理，需按 `frame_id` 删除旧检测后重建，避免重复检测记录污染检索。

## U9. MOT + ReID 同人链路入库

1. 输入：`detectionBatch[]`、`frameBatch[]`、`cameraId`。
2. Python 处理：
   - MOT 将检测串联为 `trackBatch[]`。
   - ReID 提取 `reidEmbeddingBatch[]`。
   - 计算匹配分数并生成 identity 决策。
3. 数据库写入与更新：
   - `person_tracks`：创建轨迹，写 `start_ms/end_ms/sample_count/quality_score`。
   - `person_track_hits`：关联 detection 快照。
   - `person_embeddings`：写轨迹向量。
   - `person_identities`：创建或更新全局身份，维护 `first_seen_at/last_seen_at`。
   - `person_identity_matches`：记录每次匹配证据与阈值。
   - `person_review_tasks`：仅当 `decision = NEEDS_REVIEW` 时创建。
4. 一致性校验：
   - `person_track_hits.frame_id/timestamp_ms` 必须与 `detection_id` 推导一致。
5. 输出：`identityResolutionResult`。
6. 事务与幂等策略：
   - 本阶段在单独事务内执行。
   - `attempt > 1` 时先按 `videoId` 清理历史轨迹产物（`person_tracks` 及其级联依赖），再重建。
   - `person_identities` 只做可重复关联更新，不因重试重复创建逻辑身份。

## U10. CLIP 向量化入库

1. 输入：`frameBatch[]`、`detectionBatch[]`。
2. Python 处理：
   - 生成帧级向量 `vector(512)`。
   - 可选生成检测框级向量 `vector(512)`。
3. 数据库写入：
   - `frame_embeddings(frame_id, model_name, embedding)`。
   - `detection_embeddings(detection_id, model_name, embedding)`。
4. 输出：`clipEmbeddingResult`。
5. 约束：模型名与维度必须与查询侧一致。
6. 幂等策略：
   - `frame_embeddings` 以 `(frame_id, model_name)` 作为冲突键执行 UPSERT。
   - `detection_embeddings` 以 `(detection_id, model_name)` 作为冲突键执行 UPSERT。
   - 禁止仅按 `frame_id` / `detection_id` 覆盖写入，避免多模型向量互相覆盖。

## U11. 成功收尾

1. 触发：全部处理步骤成功。
2. 数据库更新：
   - 表：`videos`
     - `status = READY`
     - `processed_at = now()`
     - `failure_reason = null`
   - 表：`video_process_jobs`
       - `status = SUCCEEDED`（按 `queue_job_id = job.id` 或 `(video_id, run_no)` 精确命中）
     - `finished_at = now()`
     - `heartbeat_at = now()`
3. 原子性要求：
   - 上述 `videos + video_process_jobs` 更新必须在同一事务提交。
4. WebSocket 推送：
   - 事件：`video.processing.completed`
   - 字段：`videoId`、`jobId`、`status=READY`、`processedAt`、`requestId`

## U12. 失败与重试分支

1. 触发：任一步骤抛错。
2. 非最终失败（可重试）：
   - `video_process_jobs.status = RETRYING`
   - 更新 `attempt`、`next_retry_at`、`error_code`、`error_stack`
   - `videos.status` 保持 `PROCESSING`
3. 最终失败（attempts 用尽）：
   - `video_process_jobs.status = FAILED`（按 `queue_job_id = job.id` 或 `(video_id, run_no)` 精确命中）
   - `video_process_jobs.finished_at = now()`
   - `videos.status = FAILED`
   - `videos.failure_reason = error summary`
4. 原子性要求：
   - 最终失败分支中的 `videos + video_process_jobs` 更新必须在同一事务提交。
5. WebSocket 推送：
   - 事件：`video.processing.failed`
   - 字段：`videoId`、`jobId`、`errorCode`、`attempt`、`maxAttempts`

## 5.1 阶段清理与重跑策略（必须）

1. 清理触发：当 `attempt > 1` 且上次执行在 `U7~U10` 任一阶段失败。
2. 本项目默认采用“根表删除 + ON DELETE CASCADE”策略，并固定删除根表顺序：
   - 先删 `person_tracks where video_id = ?`（级联删除 `person_track_hits/person_embeddings/person_identity_matches/person_review_tasks`）。
   - 再删 `frames where video_id = ?`（级联删除 `frame_detections/frame_embeddings/detection_embeddings`）。
3. 若运行环境外键约束与生产不一致，回退到手动删除拓扑（严格顺序）：
   - `person_review_tasks`
   - `person_identity_matches`
   - `person_embeddings`
   - `person_track_hits`
   - `detection_embeddings`
   - `frame_detections`
   - `frame_embeddings`
   - `person_tracks`
   - `frames`
4. 清理后重建：从 `U7` 重新执行，保证同一 `videoId` 只有一套最新结果。
5. 清理动作应写审计日志，包含 `videoId`、`attempt`、`cleanupMode(cascade|manual)`、`cleanedTables[]`。

## 6. BullMQ 事件矩阵与数据库动作

1. `waiting`：不改业务状态，可记录排队监控。
2. `active`：置 `videos.PROCESSING`，`jobs.RUNNING`，更新心跳。
3. `progress`：更新 `jobs.heartbeat_at` 与阶段进度日志。
4. `failed`（非最终）：置 `jobs.RETRYING`，记录下次重试时间。
5. `failed`（最终）：置 `jobs.FAILED` + `videos.FAILED`。
6. `completed`：置 `jobs.SUCCEEDED` + `videos.READY`。
7. `stalled`：记录告警并触发对账逻辑。
8. `outbox.dispatch.failed`：仅更新 outbox 重试字段，不直接改 `videos`。
9. `outbox.dispatch.exhausted`：写 `QUEUE_ENQUEUE_FAILED` 终态。
10. `force-reprocess`：必须生成新 `run_no`，禁止复用历史 `queueJobId`。
11. `run-mismatch`：若 `job.id` 无法匹配唯一 `video_process_jobs` 行，必须拒绝写库并上报告警。

## 7. 返回路线（前端可见）

## 7.1 上传接口返回

`POST /skyeye/videos` 立即返回：

1. `videoId`
2. `jobId`
3. `status = UPLOADED`
4. `requestId`

## 7.2 状态查询返回

`GET /skyeye/videos/:id` 返回：

1. 当前 `videos.status`
2. 若失败，返回 `failureReason`
3. 最近任务状态（attempt、maxAttempts、errorCode）

## 7.3 WebSocket 推送返回

1. `video.processing.started`
2. `video.processing.progress`（可选）
3. `video.processing.completed`
4. `video.processing.failed`

## 8. 数据一致性与补偿

1. 启动对账：扫描 `videos.status = PROCESSING` 且长时间无心跳的记录。
2. 读取 BullMQ 实际任务态，修复 `video_process_jobs` 与 `videos`。
3. 当 Redis 中任务已被清理时，用 DB 审计信息兜底：
   - 可重投则重投。
   - 不可判定则落人工复核队列。
4. 扩展对账范围：
   - 扫描 `videos.status = UPLOADED` 且超时仍无可执行任务记录的悬挂视频。
   - 对悬挂视频执行自动重投或标记 `FAILED(QUEUE_ENQUEUE_FAILED)`，避免长期无终态。
5. 频率与 SLA：
   - Outbox 派发轮询：每 `5s`。
   - 悬挂记录对账：每 `30s`。
   - 幂等租约过期扫描：每 `60s`，将过期 `CLAIMED` 置为 `EXPIRED`。
   - P95 入队延迟目标：`<= 10s`。
   - 最长修复延迟：`<= 60s`。
6. 幂等租约回收规则：
   - claim 超时未绑定时，必须自动回收。
   - claim 已绑定但流程失败时，必须在失败补偿中立即释放，不等待定时任务。

## 9. 详细评审（路线正确性审查）

## 9.1 覆盖性评审

1. NestJS、数据库、Python、YOLO11、CLIP、ffmpeg、BullMQ 均被纳入主链路。
2. 每一步都定义了输入变量、输出变量、数据库动作。
3. 同人判定链路（轨迹、身份、匹配、复核）已纳入必选流程。

## 9.2 正确性评审

1. 状态机单向迁移，避免 READY 回退。
2. 最终失败与可重试失败分离，避免误标失败。
3. `queueJobId = video:{videoId}:run:{processRunNo}` 保证入队唯一且支持重处理可重入。
4. 重处理通过 `run_no` 递增实现可重入，避免 BullMQ 旧 jobId 残留阻塞。
5. `PersonTrackHit` 与 `FrameDetection` 一致性规则已明确。

## 9.3 可运维性评审

1. 事件矩阵可追踪，具备心跳与 stalled 处理。
2. 错误栈与错误码都写审计表，支持回放。
3. 对账与补偿路径明确，支持失败恢复。

## 9.4 评审结论

该路线在工程上可执行，且满足需求文档对“上传后异步处理并通知”的完整要求。该链路被明确定义为最终一致系统：通过 outbox、补偿扫描与 SLA 约束来保证不丢任务与可恢复性，而非依赖跨 DB 与队列的强一致事务。