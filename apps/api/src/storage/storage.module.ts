import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestMinioModule } from 'nestjs-minio';
import { MinioBootstrapService } from './minio-bootstrap.service';
import { ObjectStorageService } from './object-storage.service';

@Global()
@Module({
  imports: [
    NestMinioModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.getOrThrow<string>('minio.endpoint'),
        port: configService.getOrThrow<number>('minio.port'),
        useSSL: configService.getOrThrow<boolean>('minio.useSSL'),
        accessKey: configService.getOrThrow<string>('minio.accessKey'),
        secretKey: configService.getOrThrow<string>('minio.secretKey'),
      }),
    }),
  ],
  providers: [MinioBootstrapService, ObjectStorageService],
  exports: [ObjectStorageService],
})
export class StorageModule {}