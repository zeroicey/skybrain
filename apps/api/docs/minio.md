# SkyBrain API MinIO 使用指南

本文说明后端中 MinIO 的接入方式、初始化行为、业务层调用方法与测试方式。

## 1. 已完成的集成能力

当前项目已完成以下能力：

1. 应用启动时自动初始化 MinIO 连接（由 `nestjs-minio` 完成连接检查）。
2. 应用启动时自动确保默认 bucket 存在（不存在时自动创建）。
3. 提供统一对象存储服务 `ObjectStorageService`，封装上传、下载、删除、签名下载 URL。

核心文件：

- `src/storage/storage.module.ts`
- `src/storage/minio-bootstrap.service.ts`
- `src/storage/object-storage.service.ts`

## 2. 环境变量

项目使用以下 MinIO 环境变量（已在 `.env` 中配置）：

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=skybrain
MINIO_USE_SSL=false
```

说明：

- `MINIO_ENDPOINT` 是 MinIO 服务地址，不包含协议。
- `MINIO_USE_SSL=true` 时请确保服务端证书配置正确。
- `MINIO_BUCKET_NAME` 为默认业务 bucket。

## 3. 启动初始化流程

应用启动时流程如下：

1. `StorageModule` 通过 `NestMinioModule.registerAsync` 读取配置并创建客户端。
2. `nestjs-minio` 在模块初始化时进行连接检查。
3. `MinioBootstrapService.onApplicationBootstrap` 执行 bucket 检查：
   - bucket 已存在：直接通过。
   - bucket 不存在：自动创建。
   - 发生错误：抛出异常并阻止服务以错误状态启动。

这可以避免服务启动后才暴露对象存储不可用问题。

## 4. 业务开发如何使用

推荐优先使用 `ObjectStorageService`，避免业务层直接操作 SDK。

### 4.1 注入服务

```ts
import { Controller, Get, Param } from '@nestjs/common';
import { ObjectStorageService } from '../storage/object-storage.service';

@Controller('files')
export class FilesController {
  constructor(private readonly objectStorageService: ObjectStorageService) {}

  @Get(':name/url')
  async getDownloadUrl(@Param('name') name: string) {
    const url = await this.objectStorageService.getPresignedGetUrl(name, 600);
    return { url };
  }
}
```

### 4.2 上传对象

```ts
await objectStorageService.uploadObject({
  objectName: 'drones/mission-1/report.json',
  data: Buffer.from(JSON.stringify(payload)),
  metaData: {
    'Content-Type': 'application/json',
  },
});
```

支持可选 `bucketName` 参数覆盖默认 bucket。

### 4.3 获取对象流

```ts
const stream = await objectStorageService.getObjectStream(
  'drones/mission-1/report.json',
);
```

当对象不存在时会抛出 `NotFoundException`。

### 4.4 删除对象

```ts
await objectStorageService.removeObject('drones/mission-1/report.json');
```

### 4.5 生成签名下载 URL

```ts
const url = await objectStorageService.getPresignedGetUrl(
  'drones/mission-1/report.json',
  600,
);
```

第二个参数是过期秒数，当前允许范围是 `1-3600`。

## 5. 如需直接使用原生 MinIO Client

虽然不推荐业务层直接依赖 SDK，但若确有需要，可以注入 `MINIO_CONNECTION`：

```ts
import { Inject } from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';

constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: any) {}
```

建议将直接 SDK 操作封装在基础设施层，避免散落在业务代码中。

## 6. 测试

已新增单元测试：

- `src/storage/minio-bootstrap.service.spec.ts`
- `src/storage/object-storage.service.spec.ts`

运行命令：

```bash
pnpm test -- src/storage/minio-bootstrap.service.spec.ts src/storage/object-storage.service.spec.ts
```

全量单测：

```bash
pnpm test --runInBand
```

## 7. 常见问题排查

1. 启动时报连接错误
   - 检查 `MINIO_ENDPOINT`、`MINIO_PORT` 是否可达。
   - 若容器部署，确认网络互通和端口映射。

2. 签名 URL 无法访问
   - 检查 MinIO 对外地址是否与客户端访问地址一致。
   - 反向代理场景请确认 host/header 转发正确。

3. bucket 创建失败
   - 检查账号权限是否允许创建 bucket。
   - 检查 bucket 名称是否合法且未被占用。

4. 上传时报 object name 非法
  - 当前会拒绝包含 `..`、控制字符、前导 `/` 的对象名。
  - 建议统一使用业务前缀命名，如 `drones/<id>/file.ext`。
