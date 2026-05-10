# SkyEye 数据库设计（Prisma + PostgreSQL + pgvector）

## 1. 设计目标

1. 支持视频处理全生命周期：上传、处理中、完成、失败。
2. 支持帧级与检测框级存储，满足语义检索与结构化过滤。
3. 支持 BullMQ 任务审计与失败恢复。
4. 支持向量检索高性能索引。
5. 必须支持同人判定：跨秒与跨视频身份识别。

## 2. Prisma Schema（建议）

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../src/generated/prisma"
  moduleFormat = "cjs"
}

datasource db {
  provider = "postgresql"
}

enum VideoStatus {
  UPLOADED
  PROCESSING
  READY
  FAILED
  ARCHIVED
}

enum JobStatus {
  PENDING
  RUNNING
  RETRYING
  SUCCEEDED
  FAILED
}

enum FrameSourceType {
  FPS
  SCENE_CHANGE
}

enum DetectionSource {
  YOLO11
}

enum IdempotencyStatus {
  CLAIMED
  BOUND
  RELEASED
  EXPIRED
}

enum OutboxStatus {
  NEW
  DISPATCHING
  SENT
  FAILED
}

model Video {
  id                 String      @id @default(uuid()) @db.Uuid
  cameraId           String?     @map("camera_id") @db.VarChar(80)
  name               String      @db.VarChar(120)
  originalObjectKey  String      @unique @map("original_object_key")
  durationMs         Int?        @map("duration_ms")
  fps                Int         @default(1)
  status             VideoStatus @default(UPLOADED)
  processingStartedAt DateTime?  @map("processing_started_at")
  processedAt        DateTime?   @map("processed_at")
  failureReason      String?     @map("failure_reason")
  contentChecksum    String?     @map("content_checksum") @db.VarChar(128)
  fileSizeBytes      BigInt?     @map("file_size_bytes")
  createdBy          Int?        @map("created_by")
  createdAt          DateTime    @default(now()) @map("created_at")
  updatedAt          DateTime    @updatedAt @map("updated_at")

  frames           Frame[]
  jobs             VideoProcessJob[]
  idempotencyKeys  VideoUploadIdempotency[]
  outboxRecords    VideoQueueOutbox[]

  @@index([status, createdAt(sort: Desc)])
  @@index([status, processedAt(sort: Desc)])
  @@index([cameraId, createdAt(sort: Desc)])
  @@index([createdBy])
  @@index([createdBy, contentChecksum, fileSizeBytes, createdAt(sort: Desc)])
  @@map("videos")
}

model VideoProcessJob {
  id          BigInt    @id @default(autoincrement())
  videoId     String    @map("video_id") @db.Uuid
  queueName   String    @default("skyeye-video-process") @map("queue_name") @db.VarChar(80)
  queueJobId  String    @unique @map("queue_job_id") @db.VarChar(120)
  runNo       Int       @default(1) @map("run_no")
  status      JobStatus @default(PENDING)
  attempt     Int       @default(0)
  maxAttempts Int       @default(3) @map("max_attempts")
  workerNode  String?   @map("worker_node") @db.VarChar(100)
  startedAt   DateTime? @map("started_at")
  heartbeatAt DateTime? @map("heartbeat_at")
  finishedAt  DateTime? @map("finished_at")
  nextRetryAt DateTime? @map("next_retry_at")
  errorCode   String?   @map("error_code") @db.VarChar(50)
  errorStack  String?   @map("error_stack")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  video Video @relation(fields: [videoId], references: [id], onDelete: Cascade)

  @@unique([videoId, runNo])
  @@index([queueName, status, createdAt])
  @@index([videoId, status, createdAt(sort: Desc)])
  @@index([status, createdAt])
  @@index([status, nextRetryAt, createdAt])
  @@map("video_process_jobs")
}

model VideoUploadIdempotency {
  dedupKey       String            @id @map("dedup_key") @db.VarChar(128)
  videoId        String?           @map("video_id") @db.Uuid
  status         IdempotencyStatus @default(CLAIMED)
  leaseExpiresAt DateTime          @map("lease_expires_at")
  createdBy      Int?              @map("created_by")
  createdAt      DateTime          @default(now()) @map("created_at")
  updatedAt      DateTime          @updatedAt @map("updated_at")

  video Video? @relation(fields: [videoId], references: [id], onDelete: Cascade)

  @@index([status, leaseExpiresAt])
  @@index([videoId])
  @@index([videoId, status])
  @@map("video_upload_idempotency")
}

model VideoQueueOutbox {
  id          BigInt      @id @default(autoincrement())
  videoId     String      @map("video_id") @db.Uuid
  runNo       Int         @default(1) @map("run_no")
  queueName   String      @default("skyeye-video-process") @map("queue_name") @db.VarChar(80)
  queueJobId  String      @unique @map("queue_job_id") @db.VarChar(120)
  payloadJson Json        @map("payload_json")
  status      OutboxStatus @default(NEW)
  attempt     Int         @default(0)
  nextRetryAt DateTime?   @map("next_retry_at")
  lastError   String?     @map("last_error")
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  video Video @relation(fields: [videoId], references: [id], onDelete: Cascade)

  @@index([status, nextRetryAt, createdAt])
  @@index([videoId, runNo])
  @@index([queueName, status, createdAt])
  @@map("video_queue_outbox")
}

model Frame {
  id          String          @id @default(uuid()) @db.Uuid
  videoId     String          @map("video_id") @db.Uuid
  objectKey   String          @unique @map("object_key")
  frameNo     Int             @map("frame_no")
  timestampMs Int             @map("timestamp_ms")
  width       Int
  height      Int
  sourceType  FrameSourceType @default(FPS) @map("source_type")
  sceneScore  Float?          @map("scene_score")
  createdAt   DateTime        @default(now()) @map("created_at")

  video       Video              @relation(fields: [videoId], references: [id], onDelete: Cascade)
  detections  FrameDetection[]
  embeddings  FrameEmbedding[]

  @@unique([videoId, timestampMs])
  @@index([videoId, frameNo])
  @@map("frames")
}

model FrameDetection {
  id         BigInt          @id @default(autoincrement())
  frameId    String          @map("frame_id") @db.Uuid
  classId    Int             @map("class_id")
  className  String          @map("class_name") @db.VarChar(80)
  confidence Decimal         @db.Decimal(5, 4)
  x1         Int
  y1         Int
  x2         Int
  y2         Int
  source     DetectionSource @default(YOLO11)
  createdAt  DateTime        @default(now()) @map("created_at")

  frame      Frame                @relation(fields: [frameId], references: [id], onDelete: Cascade)
  embeddings DetectionEmbedding[]

  @@index([frameId, confidence])
  @@index([className, confidence])
  @@index([frameId, className, confidence])
  @@map("frame_detections")
}

model FrameEmbedding {
  id        BigInt   @id @default(autoincrement())
  frameId   String   @map("frame_id") @db.Uuid
  modelName String   @default("clip-vit-base-patch32") @map("model_name") @db.VarChar(80)
  embedding Unsupported("vector(512)")
  createdAt DateTime @default(now()) @map("created_at")

  frame Frame @relation(fields: [frameId], references: [id], onDelete: Cascade)

  @@unique([frameId, modelName])
  @@index([modelName, createdAt(sort: Desc)])
  @@map("frame_embeddings")
}

model DetectionEmbedding {
  id          BigInt   @id @default(autoincrement())
  detectionId BigInt   @map("detection_id")
  modelName   String   @default("clip-vit-base-patch32") @map("model_name") @db.VarChar(80)
  embedding   Unsupported("vector(512)")
  createdAt   DateTime @default(now()) @map("created_at")

  detection FrameDetection @relation(fields: [detectionId], references: [id], onDelete: Cascade)

  @@unique([detectionId, modelName])
  @@index([modelName, createdAt(sort: Desc)])
  @@map("detection_embeddings")
}
```

说明：

1. `ARCHIVED` 为可选归档态，通常由 `READY` 或 `FAILED` 进入，用于冷数据管理与长期存储策略。
2. 上传主线采用“数据库强一致 + 队列最终一致”，`video_upload_idempotency` 与 `video_queue_outbox` 是必选基线表。
3. `run_no + queue_job_id` 共同保证重处理可重入与任务状态精确定位。
4. `frame_embeddings / detection_embeddings` 已支持多模型并存（通过复合唯一键约束）。
5. 幂等记录在 `CLAIMED` 阶段允许 `video_id = NULL`，在进入 `BOUND` 时必须绑定 `video_id`。

## 3. Migration（必须）

## 3.1 结构迁移：上传一致性与幂等

```sql
ALTER TABLE videos
  ADD COLUMN IF NOT EXISTS content_checksum VARCHAR(128),
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT;

CREATE INDEX IF NOT EXISTS idx_videos_created_by_checksum_size_created_at
ON videos (created_by, content_checksum, file_size_bytes, created_at DESC);

ALTER TABLE video_process_jobs
  ADD COLUMN IF NOT EXISTS run_no INT NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX IF NOT EXISTS uq_video_process_jobs_video_run
ON video_process_jobs (video_id, run_no);

CREATE TABLE IF NOT EXISTS video_upload_idempotency (
  dedup_key        VARCHAR(128) PRIMARY KEY,
  video_id         UUID REFERENCES videos(id) ON DELETE CASCADE,
  status           VARCHAR(16) NOT NULL DEFAULT 'CLAIMED',
  lease_expires_at TIMESTAMPTZ NOT NULL,
  created_by       INT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_video_upload_idempotency_bound_video
    CHECK (status <> 'BOUND' OR video_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_video_upload_idempotency_status_lease
ON video_upload_idempotency (status, lease_expires_at);

CREATE INDEX IF NOT EXISTS idx_video_upload_idempotency_video_id
ON video_upload_idempotency (video_id);

CREATE INDEX IF NOT EXISTS idx_video_upload_idempotency_video_status
ON video_upload_idempotency (video_id, status);

CREATE TABLE IF NOT EXISTS video_queue_outbox (
  id            BIGSERIAL PRIMARY KEY,
  video_id      UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  run_no        INT NOT NULL DEFAULT 1,
  queue_name    VARCHAR(80) NOT NULL DEFAULT 'skyeye-video-process',
  queue_job_id  VARCHAR(120) NOT NULL UNIQUE,
  payload_json  JSONB NOT NULL,
  status        VARCHAR(16) NOT NULL DEFAULT 'NEW',
  attempt       INT NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  last_error    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_video_queue_outbox_status_retry_created
ON video_queue_outbox (status, next_retry_at, created_at);

CREATE INDEX IF NOT EXISTS idx_video_queue_outbox_video_run
ON video_queue_outbox (video_id, run_no);

CREATE INDEX IF NOT EXISTS idx_video_queue_outbox_queue_status_created
ON video_queue_outbox (queue_name, status, created_at);
```

## 3.2 结构迁移：向量表支持多模型并存

```sql
ALTER TABLE frame_embeddings
  ADD COLUMN IF NOT EXISTS id BIGSERIAL;

ALTER TABLE detection_embeddings
  ADD COLUMN IF NOT EXISTS id BIGSERIAL;

ALTER TABLE frame_embeddings
  DROP CONSTRAINT IF EXISTS frame_embeddings_pkey;

ALTER TABLE detection_embeddings
  DROP CONSTRAINT IF EXISTS detection_embeddings_pkey;

ALTER TABLE frame_embeddings
  ADD CONSTRAINT frame_embeddings_pkey PRIMARY KEY (id);

ALTER TABLE detection_embeddings
  ADD CONSTRAINT detection_embeddings_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_frame_embeddings_frame_model
ON frame_embeddings (frame_id, model_name);

CREATE UNIQUE INDEX IF NOT EXISTS uq_detection_embeddings_detection_model
ON detection_embeddings (detection_id, model_name);

CREATE INDEX IF NOT EXISTS idx_frame_embeddings_model_name_created_at
ON frame_embeddings (model_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_detection_embeddings_model_name_created_at
ON detection_embeddings (model_name, created_at DESC);
```

## 3.3 pgvector 与查询索引

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE INDEX IF NOT EXISTS idx_frame_embeddings_hnsw
ON frame_embeddings
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_detection_embeddings_hnsw
ON detection_embeddings
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_videos_status_processed_at
ON videos (status, processed_at DESC);
```

## 3.4 Migration 执行顺序（建议）

1. 先执行 `3.1`（上传一致性与 outbox 基线）。
2. 再执行 `3.2`（向量表结构变更，建议维护窗口执行）。
3. 最后执行 `3.3`（索引与 pgvector 能力）。
4. 对大表索引在生产环境建议使用 `CREATE INDEX CONCURRENTLY`，并拆分为独立 migration。
5. ReID 相关索引（如 `person_embeddings`）应在第 4 节模型落地后再执行。
6. 若已有生产数据，务必先做影子库演练并记录回滚预案。

## 4. 必选能力：同人跨秒/跨视频识别（ReID）

该能力为必选，不再是可选增强。需要在现有 schema 上追加以下模型。

生产基线要求：第 2 节基础模型 + 第 4 节同人模型必须同时上线。

## 4.1 新增枚举

```prisma
enum IdentityStatus {
  ACTIVE
  NEEDS_REVIEW
  MERGED
  ARCHIVED
}

enum IdentityDecision {
  AUTO_MATCH
  AUTO_REJECT
  NEEDS_REVIEW
  MANUAL_MATCH
  MANUAL_REJECT
}

enum ReviewTaskStatus {
  PENDING_REVIEW
  IN_REVIEW
  RESOLVED_MATCH
  RESOLVED_REJECT
}
```

## 4.2 新增模型（追加到现有 Schema）

先在现有模型中追加反向 relation 字段：

```prisma
model Video {
  // ...existing fields
  personTracks PersonTrack[]
}

model Frame {
  // ...existing fields
  startOfTracks PersonTrack[] @relation("track_start_frame")
  endOfTracks   PersonTrack[] @relation("track_end_frame")
}

model FrameDetection {
  // ...existing fields
  trackHit PersonTrackHit?
}
```

```prisma
model PersonIdentity {
  id               String         @id @default(uuid()) @db.Uuid
  status           IdentityStatus @default(NEEDS_REVIEW)
  canonicalTrackId String?        @map("canonical_track_id") @db.Uuid
  firstSeenAt      DateTime?      @map("first_seen_at")
  lastSeenAt       DateTime?      @map("last_seen_at")
  confidence       Decimal?       @db.Decimal(6, 5)
  createdAt        DateTime       @default(now()) @map("created_at")
  updatedAt        DateTime       @updatedAt @map("updated_at")

  canonicalTrack PersonTrack? @relation("canonical_track", fields: [canonicalTrackId], references: [id], onDelete: SetNull)
  tracks  PersonTrack[]
  matches PersonIdentityMatch[]

  @@index([status, lastSeenAt])
  @@map("person_identities")
}

model PersonTrack {
  id                     String    @id @default(uuid()) @db.Uuid
  videoId                String    @map("video_id") @db.Uuid
  identityId             String?   @map("identity_id") @db.Uuid
  startFrameId           String?   @map("start_frame_id") @db.Uuid
  endFrameId             String?   @map("end_frame_id") @db.Uuid
  startMs                Int       @map("start_ms")
  endMs                  Int       @map("end_ms")
  sampleCount            Int       @default(0) @map("sample_count")
  avgDetectionConfidence Decimal   @default(0) @db.Decimal(5, 4) @map("avg_detection_confidence")
  qualityScore           Decimal?  @db.Decimal(5, 4) @map("quality_score")
  createdAt              DateTime  @default(now()) @map("created_at")
  updatedAt              DateTime  @updatedAt @map("updated_at")

  video          Video               @relation(fields: [videoId], references: [id], onDelete: Cascade)
  identity       PersonIdentity?     @relation(fields: [identityId], references: [id], onDelete: SetNull)
  startFrame     Frame?              @relation("track_start_frame", fields: [startFrameId], references: [id], onDelete: SetNull)
  endFrame       Frame?              @relation("track_end_frame", fields: [endFrameId], references: [id], onDelete: SetNull)
  canonicalFor   PersonIdentity[]    @relation("canonical_track")
  detections     PersonTrackHit[]
  embeddings     PersonEmbedding[]
  matches        PersonIdentityMatch[]

  @@index([videoId, startMs, endMs])
  @@index([identityId, startMs])
  @@map("person_tracks")
}

model PersonTrackHit {
  id          BigInt   @id @default(autoincrement())
  trackId     String   @map("track_id") @db.Uuid
  detectionId BigInt   @unique @map("detection_id")
  frameId     String   @map("frame_id") @db.Uuid
  timestampMs Int      @map("timestamp_ms")
  createdAt   DateTime @default(now()) @map("created_at")

  track     PersonTrack    @relation(fields: [trackId], references: [id], onDelete: Cascade)
  detection FrameDetection @relation(fields: [detectionId], references: [id], onDelete: Cascade)

  @@index([trackId, timestampMs])
  @@index([frameId])
  @@map("person_track_hits")
}

model PersonEmbedding {
  id           BigInt   @id @default(autoincrement())
  trackId      String   @map("track_id") @db.Uuid
  modelName    String   @default("osnet_x1_0") @map("model_name") @db.VarChar(80)
  embedding    Unsupported("vector(512)")
  qualityScore Decimal? @db.Decimal(5, 4) @map("quality_score")
  createdAt    DateTime @default(now()) @map("created_at")

  track PersonTrack @relation(fields: [trackId], references: [id], onDelete: Cascade)

  @@index([trackId, createdAt(sort: Desc)])
  @@index([modelName])
  @@map("person_embeddings")
}

model PersonIdentityMatch {
  id                  BigInt           @id @default(autoincrement())
  sourceTrackId       String           @map("source_track_id") @db.Uuid
  candidateIdentityId String?          @map("candidate_identity_id") @db.Uuid
  cosineSimilarity    Decimal          @db.Decimal(6, 5) @map("cosine_similarity")
  colorScore          Decimal?         @db.Decimal(6, 5) @map("color_score")
  spacetimeScore      Decimal?         @db.Decimal(6, 5) @map("spacetime_score")
  finalScore          Decimal          @db.Decimal(6, 5) @map("final_score")
  policyVersion       String           @map("policy_version") @db.VarChar(40)
  reidModel           String           @map("reid_model") @db.VarChar(80)
  thresholdHigh       Decimal          @db.Decimal(6, 5) @map("threshold_high")
  thresholdLow        Decimal          @db.Decimal(6, 5) @map("threshold_low")
  decision            IdentityDecision
  reviewedBy          Int?             @map("reviewed_by")
  reviewNote          String?          @map("review_note")
  createdAt           DateTime         @default(now()) @map("created_at")

  sourceTrack       PersonTrack     @relation(fields: [sourceTrackId], references: [id], onDelete: Cascade)
  candidateIdentity PersonIdentity? @relation(fields: [candidateIdentityId], references: [id], onDelete: SetNull)
  reviewTask        PersonReviewTask?

  @@index([sourceTrackId, createdAt(sort: Desc)])
  @@index([candidateIdentityId, finalScore])
  @@index([decision, createdAt])
  @@map("person_identity_matches")
}

model PersonReviewTask {
  id         BigInt           @id @default(autoincrement())
  matchId    BigInt           @unique @map("match_id")
  status     ReviewTaskStatus @default(PENDING_REVIEW)
  assigneeId Int?             @map("assignee_id")
  dueAt      DateTime?        @map("due_at")
  resolvedAt DateTime?        @map("resolved_at")
  createdAt  DateTime         @default(now()) @map("created_at")
  updatedAt  DateTime         @updatedAt @map("updated_at")

  match PersonIdentityMatch @relation(fields: [matchId], references: [id], onDelete: Cascade)

  @@index([status, dueAt])
  @@index([assigneeId, status])
  @@map("person_review_tasks")
}
```

说明：

1. `PersonTrack` 负责单视频跨秒连续身份。
2. `PersonIdentity` 负责跨视频全局身份。
3. `PersonIdentityMatch` 保存每次匹配决策证据，支持审计与人工回溯。
4. 时空先验数据来自 `Video.cameraId`，若为空则降级到仅外观判定（需降低自动决策比例）。
5. `PersonTrackHit.frameId/timestampMs` 为 detection 快照字段，写入时必须由 `detectionId` 派生并校验一致性。

## 4.3 ReID 向量索引（必须）

```sql
CREATE INDEX IF NOT EXISTS idx_person_embeddings_hnsw
ON person_embeddings
USING hnsw (embedding vector_cosine_ops);
```

## 4.4 判定阈值建议

首发默认策略（必须版本化）：

1. `policyVersion = reid-v1.0`
2. `reidModel = osnet_x1_0`
3. 融合权重：`w_e = 0.78`, `w_c = 0.12`, `w_t = 0.10`
4. 阈值：`T_high = 0.82`, `T_low = 0.65`
5. 候选召回：`TopK = 50`

判定规则：

1. `finalScore >= T_high`：自动同人。
2. `finalScore <= T_low`：自动不同人。
3. 中间区间：`NEEDS_REVIEW`，进入人工复核。
