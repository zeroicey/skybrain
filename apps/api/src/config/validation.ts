// src/config/validation.ts
import { z } from 'zod'

const REQUIRED_DB_FIELDS = [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
] as const

// 1. 定义 Zod 验证规则
export const validationSchema = z
    .object({
        // 环境
        NODE_ENV: z
            .enum(['development', 'production', 'test', 'staging'])
            .default('development'),

        // 服务器
        PORT: z.coerce.number().int().min(1).max(65535).default(3000),

        // 数据库
        DATABASE_HOST: z.string().optional(),
        DATABASE_PORT: z.coerce.number().int().min(1).max(65535).optional(),
        DATABASE_USERNAME: z.string().optional(),
        DATABASE_PASSWORD: z.string().optional(),
        DATABASE_NAME: z.string().optional(),
        DATABASE_URL: z.string().url().optional(),

        // JWT
        JWT_SECRET: z.string(),
        JWT_EXPIRES_IN: z.string().default('7d'),

        // MinIO
        MINIO_ENDPOINT: z.string(),
        MINIO_PORT: z.coerce.number().int().min(1).max(65535),
        MINIO_ACCESS_KEY: z.string(),
        MINIO_SECRET_KEY: z.string(),
        MINIO_BUCKET_NAME: z.string(),
        MINIO_USE_SSL: z
            .enum(['true', 'false'])
            .default('false')
            .transform((value) => value === 'true'),
    })
    .superRefine((config, ctx) => {
        if (config.DATABASE_URL) {
            return
        }

        for (const field of REQUIRED_DB_FIELDS) {
            const value = config[field]
            if (value === undefined || value === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [field],
                    message:
                        'DATABASE_URL 未提供时，数据库分段配置必须全部提供',
                })
            }
        }
    })

// 2. 导出类型
export type ValidationSchema = z.infer<typeof validationSchema>

// 3. 验证函数（NestJS ConfigModule 需要）
export const validate = (config: Record<string, any>) => {
    const result = validationSchema.safeParse(config)
    if (!result.success) {
        const errors = result.error.issues.map((i) => ({
            message: i.message,
            path: i.path.join('.'),
        }))
        throw new Error(
            `配置验证失败: ${errors.map((e) => `${e.path}: ${e.message}`).join(', ')}`
        )
    }
    return result.data
}