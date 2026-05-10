# SkyEye 执行计划 A：上传与异步处理主线

## 1. 文档目的

本计划将路线 A 从“设计说明”落到“可直接分配给单个 agent 的最小任务清单”，用于按阶段推进实现。

输入基线：
1. `apps/api/docs/skyeye/roadmap-upload-line.md`
2. `apps/api/docs/skyeye/requirement.md`
3. `apps/api/docs/skyeye/solution.md`
4. `apps/api/docs/skyeye/database-design.md`

## 2. 固定分层顺序

本路线执行按固定层级推进：
1. NestJS
2. Prisma
3. MinIO
4. PostgreSQL
5. ffmpeg
6. Python YOLO
7. Python CLIP

## 3. 里程碑与依赖总览

核心里程碑：
1. M0：状态机与核心 schema 就位（可阻断后续返工）。
2. M1：上传受理链路可用（请求入站、幂等、对象存储、outbox 入库）。
3. M2：异步派发可用（outbox dispatcher + bullmq worker active）。
4. M3：处理流水线可用（ffprobe/ffmpeg/YOLO/ReID/CLIP 产物入库）。
5. M4：成功/失败收尾可用（事务一致、通知、对账修复）。

关键依赖：
1. Prisma/SQL 迁移完成后，NestJS 事务编排才能稳定落地。
2. MinIO 原视频写入成功后，才允许创建 `videos` 记录并绑定幂等。
3. Outbox 入队成功不是强一致前提，必须依赖 dispatcher + 对账补偿。
4. ffmpeg 是 YOLO/CLIP 的前置；YOLO 检测是 ReID 与 detection-level CLIP 的前置。

## 4. 分层任务清单（最小可交付）

说明：每条任务默认单 PR、单负责人、单验收目标。

### 4.1 NestJS 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| A-N-01 | 建立上传域模块骨架（controller/service/error mapping） | 路线 A 状态机规则 | 上传域骨架代码 | 无 | 可启动，错误码结构统一 | 中 | 串行起点 |
| A-N-02 | 实现 U0/U0.1：入站校验 + 幂等判定编排 | 上传请求参数 | `idempotencyDecision` | A-N-01, A-P-01 | READY/PROCESSING/FAILED 命中行为符合路线图 | 高 | 串行 |
| A-N-03 | 实现 T1：上传受理事务（videos/jobs/outbox + claim bind） | MinIO 上传结果，决策结果 | 原子事务提交结果 | A-N-02, A-P-03, A-M-02, A-G-01 | 事务失败不留半状态，claim 可释放 | 高 | 串行 |
| A-N-04 | 实现 U3.1：Outbox Dispatcher 入队重试逻辑 | outbox NEW/FAILED | outbox SENT/FAILED 迁移 | A-N-03, A-G-04 | 达到上限后落 `QUEUE_ENQUEUE_FAILED` | 高 | 串行 |
| A-N-05 | 实现 U5/U11/U12：worker 生命周期、收尾事务、WS 推送、对账入口 | BullMQ 事件、阶段结果 | READY/FAILED 闭环事件 | A-N-04, A-F-03, A-Y-03, A-C-03, A-G-05 | 不出现 READY 回写 PROCESSING，最终失败原子落态 | 高 | 串行主干（WS与对账子任务可并行） |

### 4.2 Prisma 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| A-P-01 | 落地核心模型（videos/jobs/idempotency/outbox） | database-design | 可生成 client 的 schema 片段 | 无 | 关键字段和枚举齐全 | 中 | 串行 |
| A-P-02 | 落地处理模型（frames/detections/embeddings/person_*） | 路线 A 数据产物定义 | 完整处理模型 | A-P-01 | 关系完整，支持级联清理 | 高 | 串行 |
| A-P-03 | 落地事务仓储接口（T1/T3/T4） | 上述模型 | repository + transaction API | A-P-02 | claim/bind/release、成功收尾、失败收尾均可单测 | 高 | 串行 |

### 4.3 MinIO 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| A-M-01 | 统一对象键约定（original/frames） | videoId, frameNo | key builder | 无 | key 可逆追踪，无冲突 | 低 | 串行 |
| A-M-02 | 实现 U1：原视频上传 + 租约续期心跳 | 上传流、leaseDuration | `originalObjectKey/etag` | A-M-01, A-N-02 | 长上传不触发 claim 过期 | 中 | 串行 |
| A-M-03 | 实现失败补偿与读取签名（孤儿对象清理） | 错误上下文、object key | 清理与签名服务 | A-M-02 | U1/U2/U3 失败后无长期孤儿对象 | 中 | 内部可并行 |

### 4.4 PostgreSQL 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| A-G-01 | 迁移批次 1：content checksum、run_no、idempotency、outbox | schema 设计 | migration batch 1 | 无 | 约束生效，旧数据兼容 | 高 | 串行起点 |
| A-G-02 | 迁移批次 2：frames/detections/embeddings/person_* | schema 设计 | migration batch 2 | A-G-01 | 外键与级联删除可执行 | 高 | 串行 |
| A-G-03 | 启用 pgvector 与向量索引 | embedding 列 | extension + index | A-G-02 | 索引命中可验证 | 中 | 可并行（与 A-G-05） |
| A-G-04 | outbox 派发 SQL（取锁、回退、封顶） | outbox 表结构 | dispatcher SQL 脚本/查询 | A-G-01 | 并发派发无重复入队 | 高 | 串行（A-N-04 前置） |
| A-G-05 | 对账 SQL（PROCESSING/UPLOADED 悬挂，claim 过期） | jobs/videos/idempotency | reconciliation SQL | A-G-04 | 最大修复延迟可控（<=60s） | 高 | 可并行 |

### 4.5 ffmpeg 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| A-F-01 | 实现 ffprobe 元数据提取 | 原视频 URL | duration/fps/meta | A-M-03 | 元数据稳定写回 videos | 中 | 串行 |
| A-F-02 | 实现 U7：抽帧并生成 frameBatch | 视频 URL、抽帧策略 | frameBatch + object key | A-F-01 | `frame_no/timestamp_ms` 规则稳定 | 高 | 串行 |
| A-F-03 | 实现重试清理门禁（attempt>1 清理后重建） | videoId, attempt | 清理审计与重跑入口 | A-F-02, A-G-02 | 无重复帧残留，清理有日志 | 高 | 串行 |

### 4.6 Python YOLO 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| A-Y-01 | 实现 YOLO11 检测服务（模型白名单+conf 限制） | frame URL/model/conf | detectionBatch | A-F-02 | 输入非法时拒绝，输出字段齐全 | 中 | 串行 |
| A-Y-02 | 实现 MOT + ReID 轨迹/身份决策 | detectionBatch、时序帧 | track/reid/match 结果 | A-Y-01 | 支持 NEEDS_REVIEW 分流 | 高 | 串行 |
| A-Y-03 | 实现 U8/U9 入库映射与幂等规则 | YOLO/ReID 结果 | frame_detections/person_* 落库 | A-Y-02, A-P-03 | 重跑后仅一套有效轨迹与检测结果 | 高 | 串行 |

### 4.7 Python CLIP 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| A-C-01 | 实现帧级 embedding 服务 | frameBatch、modelName | frame 向量(512) | A-F-02 | 向量维度严格 512 | 中 | 可并行 |
| A-C-02 | 实现检测框级 embedding 服务 | detectionBatch、modelName | detection 向量(512) | A-Y-01 | detection 与向量一一对应 | 中 | 可并行 |
| A-C-03 | 实现模型一致性与 UPSERT 协作 | A-C-01/A-C-02 结果 | embedding 入库策略 | A-C-01, A-C-02, A-G-03 | 不覆盖其它模型向量，冲突可恢复 | 高 | 串行收口 |

## 5. 推荐实施阶段（先做什么、后做什么）

### 阶段 0（必须先做）
1. A-P-01
2. A-G-01
3. A-N-01

收益：先固化核心约束，后续实现不返工。

### 阶段 1（上传受理可用）
1. A-M-01, A-M-02
2. A-N-02, A-N-03
3. A-G-04

收益：前端已可上传并拿到稳定受理结果。

### 阶段 2（异步调度可用）
1. A-N-04
2. A-N-05（先实现 active/progress/failed/completed 事件骨架）
3. A-G-05

收益：具备最终一致能力与恢复能力。

### 阶段 3（处理产物可用）
1. A-F-01, A-F-02, A-F-03
2. A-Y-01, A-Y-02, A-Y-03
3. A-C-01, A-C-02, A-C-03

收益：可产出检索与同人判定所需全部数据。

### 阶段 4（收口与验收）
1. A-N-05 完整收口（T3/T4 原子事务 + WS）
2. 端到端回归与故障注入演练

收益：READY/FAILED 状态可信，运行可观测。

## 6. 并行策略建议

可并行：
1. A-C-01 与 A-C-02
2. A-G-03 与 A-G-05（在 A-G-02 之后）
3. A-N-05 中 WS 推送与对账任务子任务

必须串行：
1. A-N-01 -> A-N-02 -> A-N-03 -> A-N-04
2. A-P-01 -> A-P-02 -> A-P-03
3. A-F-01 -> A-F-02 -> A-F-03
4. A-Y-01 -> A-Y-02 -> A-Y-03

## 7. 任务分配模板（给单个 agent）

每个任务分配时建议固定模板：
1. 任务ID
2. 仅允许修改的文件范围
3. 依赖已完成清单
4. 验收命令与验收数据
5. 回滚方式

示例：
1. 任务ID：A-N-03
2. 修改范围：仅 `src/**/videos*`、`src/**/jobs*`、`src/**/outbox*`
3. 前置：A-N-02、A-P-03、A-M-02、A-G-01
4. 验收：事务失败注入时，无 `videos/jobs/outbox` 半状态
5. 回滚：撤销该 PR 并恢复 migration version