# SkyEye 执行计划 B：自然语言查询主线

## 1. 文档目的

本计划将路线 B 从“查询设计说明”落到“可直接分配给单个 agent 的最小任务清单”，用于按阶段推进实现。

输入基线：
1. `apps/api/docs/skyeye/roadmap-query-line.md`
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
1. M0：查询协议与游标协议可用（入站校验、cursor、scopeHash）。
2. M1：文本向量化与模型一致性可用。
3. M2：pgvector 两阶段检索可用（召回+过滤+稳定分页）。
4. M3：结果组装可用（URL 签名、meta、hasMore/nextCursor）。
5. M4：性能与可观测性可用（动态召回策略、慢查询告警、基线固化）。

关键依赖：
1. 查询仅允许基于 `READY` 视频，依赖上传主线产物完整落库。
2. 文本 embedding 模型名必须与帧向量模型名一致。
3. 翻页依赖快照冻结：`searchSnapshotAt + snapshotVideoMap + scopeHash`。
4. 排序与 cursor 比较必须同键：`quantizedDistance6 + frameId`。

## 4. 分层任务清单（最小可交付）

说明：每条任务默认单 PR、单负责人、单验收目标。

### 4.1 NestJS 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| B-N-01 | 实现 Q0 入站校验（videoIds/time/topK/query/cursor 基础校验） | 查询请求 | `validatedQueryInput` 基础版 | 无 | 非法参数返回指定错误码 | 中 | 串行起点 |
| B-N-02 | 实现 cursor 协议（编码/解码/结构校验/固定小数位） | `inCursor` | `parsedCursor` | B-N-01 | 非法 cursor 返回 `INVALID_CURSOR` | 高 | 串行 |
| B-N-03 | 实现 scopeHash + snapshotVideoMap + TTL 校验 | 请求参数、videos 快照 | 冻结查询上下文 | B-N-02, B-P-01 | 快照不一致返回 `SEARCH_SNAPSHOT_EXPIRED` | 高 | 串行 |
| B-N-04 | 实现查询编排主流程（Q1~Q7） | query、embedding、过滤条件 | `items/nextCursor/hasMore/meta` | B-N-03, B-P-02, B-P-03, B-M-02 | 同页排序稳定、翻页不重不漏 | 高 | 串行主干 |
| B-N-05 | 实现动态召回循环与路径切换策略 | topK、过滤强度 | recall rounds 执行结果 | B-N-04, B-G-04 | 最多 3 轮，超上限标记 `recallExhausted` | 高 | 可并行子任务（与响应格式化） |

### 4.2 Prisma 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| B-P-01 | 实现 READY 与 processedAt 快照读取仓储 | videoIds | snapshotVideoMap | 上传主线核心表已就位 | 非 READY 直接拒绝 | 中 | 串行 |
| B-P-02 | 实现默认路径查询仓储（ANN-first） | queryEmbedding、cursor、scope | candidateRows | B-P-01, B-G-01, B-G-02 | SQL 与排序键一致 | 高 | 可并行（与 B-P-03） |
| B-P-03 | 实现切换路径查询仓储（prefilter-first） | class/minConfidence、queryEmbedding | filtered candidateRows | B-P-01, B-G-03, B-G-04 | 切换后本页不回切 | 高 | 可并行（与 B-P-02） |

### 4.3 MinIO 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| B-M-01 | 实现 Q7：批量预签名 URL 生成 | object_key 列表 | `imageUrl[]` | MinIO 客户端可用 | 单页签名稳定，无串号 | 低 | 串行 |
| B-M-02 | 实现 URL TTL 与缺图降级策略 | 签名请求、异常 | 可容错结果集 | B-M-01 | 缺图不导致整页失败 | 中 | 串行 |

### 4.4 PostgreSQL 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| B-G-01 | 实现复合排序键 SQL（`quantizedDistance6 + frameId`） | queryEmbedding、cursor | 稳定分页 SQL | pgvector 索引可用 | 不使用原始浮点做等值比较 | 高 | 串行起点 |
| B-G-02 | 实现快照冻结 SQL（videoId+processedAt） | snapshotVideoMap | 冻结结果集版本 | B-G-01 | 重处理后旧 cursor 强制过期 | 高 | 串行 |
| B-G-03 | 实现结构化过滤 SQL（class/conf 同行命中） | candidateRows、过滤参数 | filteredRows | B-G-02 | class 与 confidence 同 detection 行命中 | 高 | 串行 |
| B-G-04 | 实现动态召回参数与路径切换阈值配置 | topK、过滤强度 | 可调策略与基线参数 | B-G-03 | 高过滤场景可收敛，且可观测 | 中 | 可并行（与性能基线） |
| B-G-05 | 落地 `EXPLAIN ANALYZE` 基线与慢查询阈值 | 关键 SQL | 基线报告与告警阈值 | B-G-04 | 可复现 P95 评估路径 | 中 | 可并行 |

### 4.5 ffmpeg 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| B-F-01 | 定义查询时间边界样本（start/end 命中规则） | frames 样本数据 | 边界测试集 | 上传抽帧完成 | 边界行为可复现 | 中 | 串行 |
| B-F-02 | 暴露抽帧元信息（fps/source_type）给查询解释层 | frame metadata | 解释字段映射 | B-F-01 | 可解释“为何命中/未命中” | 中 | 串行 |

### 4.6 Python YOLO 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| B-Y-01 | 类别映射标准化（查询 classNames -> 检测 class_name） | classNames、检测类别词表 | canonical class 映射 | YOLO 检测类别稳定 | 映射规则可版本化 | 中 | 可并行 |
| B-Y-02 | confidence 阈值语义统一（服务端与 SQL） | detection confidence | 一致阈值策略 | B-Y-01 | 同一阈值在两侧行为一致 | 中 | 串行 |

### 4.7 Python CLIP 层

| 任务ID | 最小任务目标 | 输入 | 输出 | 前置依赖 | 验收标准 | 难度 | 并行性 |
|---|---|---|---|---|---|---|---|
| B-C-01 | 实现文本 embedding 服务（512 维） | queryNormalized、modelName | `queryEmbeddingVec` | 无（可最早启动） | 失败返回 `QUERY_EMBEDDING_FAILED` | 中 | 可并行 |
| B-C-02 | 实现模型一致性校验（请求模型 vs 入库模型） | modelName、DB model_name | 一致性判定 | B-C-01 | 不一致返回 `MODEL_MISMATCH` | 高 | 串行 |
| B-C-03 | 实现文本向量调用的超时/重试/熔断 | 模型服务调用 | 稳定降级行为 | B-C-01 | 上游抖动不拖垮查询主链 | 中 | 可并行 |

## 5. 推荐实施阶段（先做什么、后做什么）

### 阶段 0（先打底）
1. B-N-01, B-N-02
2. B-P-01
3. B-C-01

收益：形成可验证的查询协议骨架。

### 阶段 1（先做可演示）
1. B-G-01
2. B-N-03
3. B-M-01
4. B-N-04（最小可用版）

收益：可以在种子 READY 数据上演示自然语言检索。

### 阶段 2（做稳定分页与强过滤）
1. B-G-02, B-G-03
2. B-P-02, B-P-03
3. B-Y-01, B-Y-02
4. B-M-02

收益：分页稳定，过滤语义完整且可解释。

### 阶段 3（做性能与生产化）
1. B-G-04, B-G-05
2. B-N-05
3. B-C-02, B-C-03

收益：高过滤场景可收敛，可观测指标完整。

## 6. 并行策略建议

可并行：
1. B-P-02 与 B-P-03（B-P-01 后）
2. B-C-03 与 B-C-02（B-C-01 后）
3. B-G-05 与 B-G-04（策略确定后并行做基线）
4. B-N-05 与 B-N-04 的响应格式化子任务

必须串行：
1. B-N-01 -> B-N-02 -> B-N-03
2. B-G-01 -> B-G-02 -> B-G-03
3. B-M-01 -> B-M-02

## 7. 与上传路线的前后关系

可以先做（不依赖完整上传流水线）：
1. B-N-01, B-N-02, B-C-01
2. B-G-01（在已有种子向量数据前提下）

必须后做（依赖上传产物稳定）：
1. B-G-02（processedAt 冻结依赖真实重处理行为）
2. B-P-03（高过滤切换依赖真实检测数据分布）
3. B-N-05（动态召回生产参数需要真实流量特征）

## 8. 任务分配模板（给单个 agent）

每个任务分配时建议固定模板：
1. 任务ID
2. 仅允许修改的文件范围
3. 依赖已完成清单
4. 验收命令与验收数据
5. 回滚方式

示例：
1. 任务ID：B-G-03
2. 修改范围：仅查询 SQL 文件与查询仓储层
3. 前置：B-G-02 完成
4. 验收：`classNames + minConfidence` 同行命中测试全通过
5. 回滚：回退该 SQL 版本与对应仓储改动