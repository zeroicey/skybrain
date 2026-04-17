import { buildDatabaseUrl } from './database-url'

// src/config/configuration.ts
const parseEnvPort = (
    value: string | undefined,
    fallback?: number,
): number => {
    if (!value) {
        return fallback ?? 0
    }

    const parsedPort = Number.parseInt(value, 10)
    return Number.isNaN(parsedPort) ? fallback ?? 0 : parsedPort
}

const parseEnvBoolean = (value: string | undefined, fallback = false): boolean => {
    if (!value) {
        return fallback
    }

    return value === 'true'
}

export default () => ({
    isProduction: process.env.NODE_ENV === 'production',

    // 服务器配置
    server: {
        port: parseEnvPort(process.env.PORT, 3000),
        isProduction: process.env.NODE_ENV === 'production',
    },

    // 数据库配置
    database: {
        host: process.env.DATABASE_HOST,
        port: parseEnvPort(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
        directUrl: process.env.DATABASE_URL,
        // 构建连接 URL
        get url() {
            return buildDatabaseUrl({
                databaseUrl: this.directUrl,
                host: this.host,
                port: this.port,
                username: this.username,
                password: this.password,
                name: this.name,
            })
        },
    },

    // JWT 配置
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },

    // MinIO 配置
    minio: {
        endpoint: process.env.MINIO_ENDPOINT,
        port: parseEnvPort(process.env.MINIO_PORT),
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
        bucketName: process.env.MINIO_BUCKET_NAME,
        useSSL: parseEnvBoolean(process.env.MINIO_USE_SSL, false),
    },

    // Logger 配置
    logger: {
        level:
            process.env.LOG_LEVEL ||
            (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        pretty: parseEnvBoolean(
            process.env.LOG_PRETTY,
            process.env.NODE_ENV !== 'production',
        ),
    },
});