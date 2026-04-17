import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'node:stream';
import { MINIO_CONNECTION } from 'nestjs-minio';

type MinioClient = {
  putObject(
    bucketName: string,
    objectName: string,
    data: Buffer | Readable,
    size?: number,
    metaData?: Record<string, string | number>,
  ): Promise<string | unknown>;
  getObject(bucketName: string, objectName: string): Promise<Readable>;
  removeObject(bucketName: string, objectName: string): Promise<void>;
  presignedGetObject(
    bucketName: string,
    objectName: string,
    expiresInSeconds?: number,
  ): Promise<string>;
};

type MinioError = {
  code?: string;
  message?: string;
};

const MIN_PRESIGNED_URL_EXPIRES_SECONDS = 1;
const MAX_PRESIGNED_URL_EXPIRES_SECONDS = 3600;

export type UploadObjectInput = {
  objectName: string;
  data: Buffer | Readable;
  size?: number;
  metaData?: Record<string, string | number>;
  bucketName?: string;
};

export type UploadObjectResult = {
  bucketName: string;
  objectName: string;
  etag?: string;
};

@Injectable()
export class ObjectStorageService {
  private readonly logger = new Logger(ObjectStorageService.name);

  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: MinioClient,
    private readonly configService: ConfigService,
  ) {}

  async uploadObject(input: UploadObjectInput): Promise<UploadObjectResult> {
    const objectName = this.normalizeObjectName(input.objectName);
    const bucketName = this.resolveBucketName(input.bucketName);

    if (!input.data) {
      throw new BadRequestException('Object payload is required');
    }

    try {
      const etag = await this.minioClient.putObject(
        bucketName,
        objectName,
        input.data,
        input.size,
        input.metaData,
      );

      return {
        bucketName,
        objectName,
        etag: typeof etag === 'string' ? etag : undefined,
      };
    } catch (error) {
      this.logger.error('Failed to upload object', this.getErrorMessage(error));
      throw new InternalServerErrorException('Failed to upload object');
    }
  }

  async getObjectStream(
    objectName: string,
    bucketName?: string,
  ): Promise<Readable> {
    const resolvedObjectName = this.normalizeObjectName(objectName);
    const resolvedBucketName = this.resolveBucketName(bucketName);

    try {
      return await this.minioClient.getObject(
        resolvedBucketName,
        resolvedObjectName,
      );
    } catch (error) {
      if (this.isObjectNotFoundError(error)) {
        throw new NotFoundException(`Object not found: ${resolvedObjectName}`);
      }

      this.logger.error('Failed to fetch object', this.getErrorMessage(error));
      throw new InternalServerErrorException('Failed to fetch object');
    }
  }

  async removeObject(objectName: string, bucketName?: string): Promise<void> {
    const resolvedObjectName = this.normalizeObjectName(objectName);
    const resolvedBucketName = this.resolveBucketName(bucketName);

    try {
      await this.minioClient.removeObject(resolvedBucketName, resolvedObjectName);
    } catch (error) {
      if (this.isObjectNotFoundError(error)) {
        throw new NotFoundException(`Object not found: ${resolvedObjectName}`);
      }

      this.logger.error('Failed to remove object', this.getErrorMessage(error));
      throw new InternalServerErrorException('Failed to remove object');
    }
  }

  async getPresignedGetUrl(
    objectName: string,
    expiresInSeconds = 3600,
    bucketName?: string,
  ): Promise<string> {
    const resolvedObjectName = this.normalizeObjectName(objectName);
    const resolvedBucketName = this.resolveBucketName(bucketName);

    if (
      expiresInSeconds < MIN_PRESIGNED_URL_EXPIRES_SECONDS ||
      expiresInSeconds > MAX_PRESIGNED_URL_EXPIRES_SECONDS
    ) {
      throw new BadRequestException(
        `expiresInSeconds must be between ${MIN_PRESIGNED_URL_EXPIRES_SECONDS} and ${MAX_PRESIGNED_URL_EXPIRES_SECONDS}`,
      );
    }

    try {
      return await this.minioClient.presignedGetObject(
        resolvedBucketName,
        resolvedObjectName,
        expiresInSeconds,
      );
    } catch (error) {
      if (this.isObjectNotFoundError(error)) {
        throw new NotFoundException(`Object not found: ${resolvedObjectName}`);
      }

      this.logger.error(
        'Failed to generate download URL',
        this.getErrorMessage(error),
      );
      throw new InternalServerErrorException('Failed to generate download URL');
    }
  }

  private resolveBucketName(bucketName?: string): string {
    const defaultBucketName = this.configService.getOrThrow<string>(
      'minio.bucketName',
    );

    if (!bucketName) {
      return defaultBucketName;
    }

    const trimmedBucketName = bucketName.trim();
    if (!trimmedBucketName) {
      throw new BadRequestException('Bucket name cannot be empty');
    }

    return trimmedBucketName;
  }

  private normalizeObjectName(objectName: string): string {
    const trimmedObjectName = objectName?.trim();
    if (!trimmedObjectName) {
      throw new BadRequestException('Object name cannot be empty');
    }

    if (
      trimmedObjectName.startsWith('/') ||
      trimmedObjectName.includes('..') ||
      /[\u0000-\u001F\u007F]/.test(trimmedObjectName)
    ) {
      throw new BadRequestException('Object name contains invalid characters');
    }

    return trimmedObjectName;
  }

  private isObjectNotFoundError(error: unknown): boolean {
    const code = (error as MinioError)?.code;
    return code === 'NoSuchKey' || code === 'NotFound' || code === 'NoSuchObject';
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    const message = (error as MinioError)?.message;
    return message ?? String(error);
  }
}