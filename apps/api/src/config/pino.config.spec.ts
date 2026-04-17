import { ConfigService } from '@nestjs/config';
import { createPinoParams } from './pino.config';

describe('createPinoParams', () => {
  const createConfigServiceMock = (
    nodeEnv: string,
    level: string,
    pretty: boolean,
  ): ConfigService => {
    return {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'server.isProduction') {
          return nodeEnv === 'production';
        }
        if (key === 'logger.level') {
          return level;
        }
        if (key === 'logger.pretty') {
          return pretty;
        }
        throw new Error(`Unexpected config key: ${key}`);
      }),
    } as unknown as ConfigService;
  };

  it('should enable pretty transport in non-production', () => {
    const configService = createConfigServiceMock('development', 'debug', true);

    const params = createPinoParams(configService);

    expect(params.pinoHttp).toEqual(
      expect.objectContaining({
        level: 'debug',
        transport: expect.objectContaining({
          target: 'pino-pretty',
        }),
      }),
    );
  });

  it('should disable pretty transport in production', () => {
    const configService = createConfigServiceMock('production', 'info', true);

    const params = createPinoParams(configService);

    expect(params.pinoHttp).toEqual(
      expect.objectContaining({
        level: 'info',
      }),
    );
    expect((params.pinoHttp as { transport?: unknown }).transport).toBeUndefined();
  });

  it('should disable pretty transport when pretty is false in non-production', () => {
    const configService = createConfigServiceMock('development', 'debug', false);

    const params = createPinoParams(configService);

    expect((params.pinoHttp as { transport?: unknown }).transport).toBeUndefined();
  });

  it('should force production debug and trace level to info', () => {
    const debugConfigService = createConfigServiceMock('production', 'debug', false);
    const traceConfigService = createConfigServiceMock('production', 'trace', false);

    const debugParams = createPinoParams(debugConfigService);
    const traceParams = createPinoParams(traceConfigService);

    expect((debugParams.pinoHttp as { level?: string }).level).toBe('info');
    expect((traceParams.pinoHttp as { level?: string }).level).toBe('info');
  });

  it('should include redact paths for sensitive headers', () => {
    const configService = createConfigServiceMock('development', 'info', false);

    const params = createPinoParams(configService);

    expect(params.pinoHttp).toEqual(
      expect.objectContaining({
        redact: expect.objectContaining({
          paths: expect.arrayContaining([
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers["set-cookie"]',
            'req.headers.x-api-key',
            'req.body.password',
            'req.body.refreshToken',
          ]),
        }),
      }),
    );
  });
});