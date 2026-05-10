# SkyEye 路线图 B：用户自然语言查询主线（NestJS + CLIP + PostgreSQL/pgvector）

## 1. 目标

该主线解决“用户在已处理视频范围内，通过自然语言与时间区间检索匹配画面”的完整流程，覆盖：

1. 查询请求校验。
2. 文本向量化。
3. pgvector 相似度召回。
4. 结构化过滤（视频、时间、类别、置信度）。
5. 稳定分页（cursor）。
6. 返回图片链接与时间点。

成功标准：

1. 仅在 `READY` 视频中检索。
2. 返回结果可稳定翻页，不重不漏。
3. 查询链路与上传链路模型一致（向量维度/模型名一致）。
4. 错误可追踪、可解释。

## 2. 前置依赖与数据来源

查询主线依赖上传主线产物：

1. `videos`：视频状态与范围。
2. `frames`：帧基础信息和对象存储 key。
3. `frame_embeddings`：帧级向量。
4. `frame_detections`：类别与置信度过滤。
5. `detection_embeddings`：可选对象级检索。

前置条件：

1. `videoIds` 至少包含一个视频。
2. 目标视频都处于 `READY`（否则直接拒绝并返回 `VIDEO_NOT_READY`）。
3. `startMs <= endMs`。
4. `query` 非空。

## 3. 变量字典与传递规范

## 3.1 请求输入变量

1. `inVideoIds: string[]`
2. `inStartMs: number`
3. `inEndMs: number`
4. `inQueryText: string`
5. `inClassNames: string[] | null`
6. `inMinConfidence: number | null`
7. `inTopK: number`
8. `inCursor: string | null`（Base64URL 编码游标）
9. `inRequestId: string`
10. `inEmbeddingModelName: string | null`（为空时使用服务端默认模型）。

## 3.2 中间变量

1. `queryNormalized: string` 归一化文本。
2. `queryEmbeddingVec: number[512]` 文本向量。
3. `recallLimit: number` 过采样上限（例如 `topK * 3`）。
4. `candidateRows[]` 向量召回候选。
5. `filteredRows[]` 应用结构化过滤后候选。
6. `rankedRows[]` 排序后的最终候选。
7. `cursorAnchor` 当前页最后一条记录的 `(distance, frameId)`。
8. `parsedCursor: { lastDistanceFixed: string, lastFrameId: string, searchSnapshotAt: string, scopeHash: string, embeddingModelName: string, snapshotVideoMap: Array<{ videoId: string, processedAt: string }> } | null`。
9. `effectiveEmbeddingModelName: string` 实际检索模型名。
10. `searchSnapshotAt: string` 当前检索快照时间。
11. `snapshotVideoMap[]` 视频版本快照（按 `videoId + processedAt` 冻结）。
12. `scopeHash: string` 由请求范围参数生成的哈希。

## 3.3 输出变量

1. `outItems[]`
2. `outNextCursor`
3. `outHasMore`
4. `outMeta`（耗时、命中数、模型信息）
5. `outRequestId`

## 4. 查询步骤（逐步说明处理、变量、数据库访问）

## 4.1 Cursor 协议（必须）

1. `inCursor` 由服务端生成并返回给前端，前端只透传。
2. 编码格式：`Base64URL(JSON.stringify({ lastDistanceFixed, lastFrameId, searchSnapshotAt, scopeHash, embeddingModelName, snapshotVideoMap }))`。
3. `lastDistanceFixed` 采用固定小数位字符串（建议 6 位），避免浮点等值漂移。
4. 服务端必须校验 cursor 结构、数值范围、UUID 格式，不合法返回 `INVALID_CURSOR`。
5. 强制规则：排序键与游标比较键必须完全一致，统一使用 `quantizedDistance6 = round(distance::numeric, 6)`。
6. 快照规则：
   - 首次查询（无 cursor）时，服务端创建 `searchSnapshotAt` 与 `snapshotVideoMap`。
   - 翻页时必须沿用同一 `searchSnapshotAt/snapshotVideoMap/scopeHash/embeddingModelName`。
7. 快照失效规则：
   - 默认 `SEARCH_SNAPSHOT_TTL = 10min`，超时返回 `SEARCH_SNAPSHOT_EXPIRED`。
   - 若 scopeHash 不匹配，返回 `INVALID_CURSOR`。

## Q0. 请求入站与参数校验（NestJS）

1. 输入：`inVideoIds`、`inStartMs`、`inEndMs`、`inQueryText`、`inTopK`。
2. 校验：
   - `inVideoIds` 非空。
   - `inStartMs >= 0`，`inEndMs >= inStartMs`。
   - `inTopK` 落在安全范围（例如 1~100）。
   - 若存在 `inCursor`，先解码为 `parsedCursor` 并校验字段合法性。
   - 解析 `effectiveEmbeddingModelName`：优先用 `inEmbeddingModelName`，否则使用服务端默认。
   - 生成 `scopeHash = hash(sortedVideoIds + startMs + endMs + query + classNames + minConfidence + effectiveEmbeddingModelName)`。
3. 数据库读取：
   - 校验 `videos.status = READY`。
   - 首次查询生成 `snapshotVideoMap(videoId, processedAt)` 与 `searchSnapshotAt`。
   - 翻页查询校验 `parsedCursor.snapshotVideoMap` 与当前请求 `videoIds` 一致。
   - 翻页查询校验当前 `videos.processed_at` 必须逐条等于 `parsedCursor.snapshotVideoMap`，不一致则返回 `SEARCH_SNAPSHOT_EXPIRED`。
4. 输出：`validatedQueryInput`（含 `effectiveEmbeddingModelName/searchSnapshotAt/snapshotVideoMap/scopeHash`）。
5. 失败返回：`EMPTY_SEARCH_SCOPE`、`INVALID_TIME_RANGE`、`VIDEO_NOT_READY`、`INVALID_CURSOR`、`SEARCH_SNAPSHOT_EXPIRED`、`MODEL_MISMATCH`。

## Q1. 文本预处理与标准化

1. 输入：`inQueryText`。
2. 处理：
   - 去除多余空白。
   - 可选同义词归一化。
   - 可选中文规范化。
3. 数据库：无。
4. 输出：`queryNormalized`。

## Q2. 文本向量化（CLIP 文本编码）

1. 输入：`queryNormalized`。
2. 处理系统：Python 模型服务（CLIP）。
3. 输出：`queryEmbeddingVec`。
4. 约束：
   - 维度必须是 `512`。
   - 文本编码模型必须等于 `effectiveEmbeddingModelName`。
5. 失败返回：`QUERY_EMBEDDING_FAILED`。

## Q3. pgvector 第一阶段召回（粗召回）

1. 输入：`queryEmbeddingVec`、`inVideoIds`、`inStartMs`、`inEndMs`、`parsedCursor`、`recallLimit`、`effectiveEmbeddingModelName`、`snapshotVideoMap`。
2. 数据库读取：
   - 主要表：`frame_embeddings fe` JOIN `frames f` JOIN `videos v`。
3. 过滤：
   - `f.video_id IN inVideoIds`
   - `f.timestamp_ms BETWEEN inStartMs AND inEndMs`
   - `v.status = READY`
   - `fe.model_name = effectiveEmbeddingModelName`
   - `v.id + v.processed_at` 必须命中 `snapshotVideoMap`（冻结结果集版本）
4. 量化键：`quantizedDistance6 = round(distance::numeric, 6)`。
5. 排序：`quantizedDistance6 ASC, frameId ASC`。
6. 分页条件：
    - 当 `parsedCursor` 存在：
     - `quantizedDistance6 > lastDistanceFixed::numeric`
     - 或 `quantizedDistance6 = lastDistanceFixed::numeric AND frameId > lastFrameId`
   - 禁止使用原始 `distance` 与游标做等值比较。
7. 动态召回循环（必须）：
   - 初始 `recallLimit = topK * 3`。
   - 若过滤后不足 `topK`，按 `x2` 递增，最多 `3` 轮。
   - 最大上限 `topK * 24`，超过上限则停止扩张并标记 `meta.recallExhausted = true`。
8. 输出：`candidateRows[]`。
9. 失败返回：`VECTOR_SEARCH_FAILED`。

## Q3.1 召回策略决策表（必须）

1. 默认路径：先执行 ANN 召回，再执行 Q4 过滤。
2. 切换条件：当过滤强度高且到达切换阈值（默认第 2 轮后仍 `filteredRows < topK`）时，切换到“先筛 frame 子集再 ANN”。
3. 优先级：切换后在同一次请求分页中不回切，直到当前页完成。
4. 一致性约束：无论采用哪条路径，都必须沿用同一 `searchSnapshotAt/snapshotVideoMap` 与同一排序键 `quantizedDistance6 + frameId`。

## Q4. 第二阶段结构化过滤（精筛）

1. 输入：`candidateRows[]`、`inClassNames`、`inMinConfidence`。
2. 数据库读取：
   - `frame_detections`（通过 `EXISTS` 子查询或预聚合视图）。
3. 过滤规则：
   - 若 `inMinConfidence` 存在，要求至少一个检测框满足置信度。
   - 若 `inClassNames` 存在，要求检测类别命中。
   - 若两者都存在，必须在同一条 detection 记录上同时满足（不能分别命中不同框）。
4. 输出：`filteredRows[]`。
5. 备注：
   - `inClassNames` 是可选过滤项；一旦传入则必须生效。
   - 必须先过采样再过滤，避免返回数量不足。
   - 当 `inClassNames/minConfidence` 过滤强度高且达到切换阈值（默认动态召回第 2 轮后仍不足 `topK`）时，必须切换“先筛 frame 子集再 ANN”模式。
   - 路径切换后本页不回切，避免同页内执行计划抖动导致结果不一致。

## Q5. 排序、打分归一与截断

1. 输入：`filteredRows[]`。
2. 排序：`quantizedDistance6 ASC, frameId ASC`（固定规则）。
3. 评分语义：
   - `distance` 是检索判定与排序的唯一权威值。
   - `displayScore` 仅用于前端展示（可选），不作为阈值和业务决策依据。
4. `hasMore` 计算：先取 `inTopK + 1` 条作为 `pageRowsPlusOne[]`。
5. 截断：若 `pageRowsPlusOne.length > inTopK`，仅返回前 `inTopK`。
6. 输出：`rankedRows[]`。

## Q6. nextCursor 生成

1. 输入：`rankedRows[]`。
2. 规则：
   - 若数量为 0，`outNextCursor = null`。
   - 若数量大于 0，取最后一行并生成：`lastDistanceFixed = rankedRows[-1].quantizedDistance6`，`lastFrameId = rankedRows[-1].frameId`。
3. `outHasMore` 规则：`pageRowsPlusOne.length > inTopK`。
4. 输出：`outNextCursor`、`outHasMore`。

## Q7. 结果组装与 URL 签名

1. 输入：`rankedRows[]`。
2. 处理：
   - 读取 `frames.object_key`。
   - 生成 MinIO 预签名 URL（短期有效）。
3. 输出：`outItems[]`，每项包含：
   - `videoId`
   - `frameId`
   - `timestampMs`
   - `imageUrl`
   - `distance`（权威分值）
   - `displayScore`（可选展示分）
4. 返回：`outItems + outNextCursor + outMeta + outRequestId`。
5. 必须包含：`outHasMore`。

## 5. 查询链路数据库访问表与时机

1. 入口校验（Q0）：读 `videos`（状态检查）。
2. 向量召回（Q3）：读 `frame_embeddings`、`frames`、`videos`。
3. 结构过滤（Q4）：读 `frame_detections`。
4. 返回组装（Q7）：读 `frames.object_key` 并签名 URL。

默认策略：查询主线不写业务表（只读）。

## 6. 返回路线（接口契约）

## 6.1 请求示例

1. `videoIds`: 检索视频范围。
2. `startMs/endMs`: 时间边界。
3. `query`: 自然语言描述。
4. `classNames`: 可选类别限制。
5. `minConfidence`: 可选置信度下限。
6. `topK`: 返回条数。
7. `cursor`: 分页游标。
8. `embeddingModelName`: 可选模型名（用于多模型并存场景）。

## 6.2 响应结构

1. `items[]`：命中结果。
2. `nextCursor`：下一页游标。
3. `hasMore`：是否还有更多。
4. `meta`：
   - `modelName`
   - `searchSnapshotAt`
   - `scopeHash`
   - `elapsedMs`
   - `candidateCount`
   - `filteredCount`
5. `requestId`

## 6.3 关键错误码

1. `INVALID_TIME_RANGE`
2. `EMPTY_SEARCH_SCOPE`
3. `VIDEO_NOT_READY`
4. `INVALID_CURSOR`
5. `QUERY_EMBEDDING_FAILED`
6. `VECTOR_SEARCH_FAILED`
7. `SEARCH_SNAPSHOT_EXPIRED`
8. `MODEL_MISMATCH`

## 7. 关键正确性规则

1. 只允许 READY 视频参与检索。
2. 查询分页必须使用 `(distance, frameId)` 复合键，不能只用 `frameId`。
3. 同一 `searchSnapshotAt + snapshotVideoMap + scopeHash` 下翻页保证不重不漏。
   - 若视频在翻页期间被重处理（`processed_at` 变化），接口返回 `SEARCH_SNAPSHOT_EXPIRED`，要求客户端发起新查询。
4. `minConfidence` 与 `classNames` 必须真实生效，且同时存在时要在同一 detection 行命中。
5. 模型名与向量维度在查询侧和处理侧保持一致，且 SQL 必须带 `model_name` 约束。
6. cursor 距离字段必须使用固定小数位字符串，不直接透传原始浮点数。

## 8. 性能与可观测性建议

1. P95 延迟目标：`< 1500ms`（TopK=20，视频数 <= 20）。
2. 必须记录阶段耗时：
   - 向量化耗时
   - SQL 耗时
   - URL 签名耗时
3. 上线前执行 `EXPLAIN ANALYZE` 并固化基线。
4. 慢查询阈值告警（例如 > 500ms）。
5. 动态召回策略（必须）：
   - 该策略已在 Q3 固化为主流程强制步骤。
   - 监控项必须包含每次查询的 `recallRounds` 与 `finalRecallLimit`。
6. 强过滤优化策略（class/minConfidence 约束强时）：
   - 该策略已在 Q4 固化为主流程条件分支。
   - 对高频过滤条件可维护候选物化视图/候选表，避免 ANN 后过滤放大。
7. 多模型并存索引策略：
   - 必须评估 `model_name` 过滤后的索引命中。
   - 必要时采用按模型分表或按模型 partial HNSW 索引。

## 9. 详细评审（路线正确性审查）

## 9.1 覆盖性评审

1. 主线完整覆盖 NestJS、CLIP、PostgreSQL/pgvector、MinIO 签名 URL。
2. 输入、处理中间态、输出变量都已定义。
3. 与上传主线数据产物对接关系明确。

## 9.2 正确性评审

1. 前置校验阻断了非 READY 数据和非法时间范围。
2. 两阶段检索顺序正确：先召回后过滤再截断。
3. cursor 设计采用稳定排序键，满足分页一致性。
4. 错误码语义清晰，前端可稳定分支处理。

## 9.3 可运维性评审

1. 关键阶段耗时可观测，便于定位瓶颈。
2. 查询主线默认只读，降低一致性风险。
3. 基线 SQL 与索引命中检查路径明确。

## 9.4 评审结论

该查询路线在工程上可直接实施，并与上传处理主线形成闭环。只要遵守“READY 前置校验 + 两阶段检索 + 复合游标分页”三条核心规则，结果正确性和稳定性可以得到保障。