# SkyBrain API Pino 日志指南

本项目已集成 `nestjs-pino`，用于统一结构化日志输出与请求日志自动采集。

## 1. 集成位置

- 根模块接入：`src/app.module.ts`
- 启动绑定应用 logger：`src/main.ts`
- Pino 参数工厂：`src/config/pino.config.ts`
- 环境配置与校验：`src/config/configuration.ts`、`src/config/validation.ts`

## 2. 环境变量

```env
# Pino Logger
LOG_LEVEL=debug
LOG_PRETTY=true
```

说明：

1. `LOG_LEVEL` 可选值：`fatal | error | warn | info | debug | trace | silent`
2. `LOG_PRETTY=true` 时，非生产环境会启用 `pino-pretty` 可读输出
3. 生产环境建议使用 JSON 输出（`LOG_PRETTY=false`）
4. 当环境为 production 且 `LOG_LEVEL` 配置为 `debug/trace` 时，系统会自动降级为 `info`

## 3. 已启用行为

1. 启动时通过 `bufferLogs: true` 缓冲早期日志，并切换到 Pino logger
2. 自动记录请求/响应日志（由 `pino-http` 中间件提供）
3. 自动脱敏敏感头字段：
   - `req.headers.authorization`
  - `req.headers.proxy-authorization`
  - `req.headers.x-api-key`
  - `req.headers.x-auth-token`
  - `req.headers.x-amz-security-token`
   - `req.headers.cookie`
   - `res.headers["set-cookie"]`
4. 预置 body 脱敏字段（当后续启用 body logging 时同样生效）：
  - `req.body.password`
  - `req.body.newPassword`
  - `req.body.token`
  - `req.body.refreshToken`
  - `req.body.accessToken`

## 4. 业务代码如何记录日志

项目中推荐继续使用 Nest 标准 Logger：

```ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ExampleService {
  private readonly logger = new Logger(ExampleService.name);

  doWork() {
    this.logger.log('do work');
    this.logger.debug({ phase: 'prepare' }, 'step start');
  }
}
```

`nestjs-pino` 会接管这些日志并输出为结构化格式。

## 5. 本地验证

```bash
pnpm build
pnpm test -- src/config/pino.config.spec.ts
```
