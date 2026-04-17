import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export const createPinoParams = (configService: ConfigService): Params => {
  const isProduction = configService.getOrThrow<boolean>('server.isProduction');
  const level = configService.getOrThrow<string>('logger.level');
  const pretty = configService.getOrThrow<boolean>('logger.pretty');
  const effectiveLevel =
    isProduction && ['debug', 'trace'].includes(level) ? 'info' : level;

  return {
    pinoHttp: {
      level: effectiveLevel,
      transport:
        !isProduction && pretty
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
                translateTime: 'SYS:standard',
              },
            }
          : undefined,
      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.proxy-authorization',
          'req.headers.x-api-key',
          'req.headers.x-auth-token',
          'req.headers.x-amz-security-token',
          'req.headers.cookie',
          'res.headers["set-cookie"]',
          'req.body.password',
          'req.body.newPassword',
          'req.body.token',
          'req.body.refreshToken',
          'req.body.accessToken',
        ],
        censor: '[REDACTED]',
      },
    },
  };
};