import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MINIO_CONNECTION } from 'nestjs-minio';

type MinioClient = {
  bucketExists(bucketName: string): Promise<boolean>;
  makeBucket(bucketName: string, region?: string): Promise<void>;
};

type MinioError = {
  code?: string;
  message?: string;
};

@Injectable()
export class MinioBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MinioBootstrapService.name);

  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: MinioClient,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.ensureBucketExists();
  }

  async ensureBucketExists(): Promise<void> {
    const bucketName = this.configService.getOrThrow<string>('minio.bucketName');

    try {
      const isBucketExists = await this.minioClient.bucketExists(bucketName);
      if (isBucketExists) {
        return;
      }

      try {
        await this.minioClient.makeBucket(bucketName);
        this.logger.log(`MinIO bucket created: ${bucketName}`);
      } catch (error) {
        if (!this.isBucketAlreadyExists(error)) {
          throw error;
        }
      }
    } catch (error) {
      this.logger.error(
        `MinIO bucket initialization failed: ${this.getErrorMessage(error)}`,
      );
      throw new InternalServerErrorException('MinIO bucket initialization failed');
    }
  }

  private isBucketAlreadyExists(error: unknown): boolean {
    const code = (error as MinioError)?.code;
    return code === 'BucketAlreadyOwnedByYou' || code === 'BucketAlreadyExists';
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}