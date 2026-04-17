import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { MinioBootstrapService } from './minio-bootstrap.service';

describe('MinioBootstrapService', () => {
  let service: MinioBootstrapService;

  const minioClientMock = {
    bucketExists: jest.fn(),
    makeBucket: jest.fn(),
  };

  const configServiceMock = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'minio.bucketName') {
        return 'skybrain';
      }
      throw new Error(`unexpected config key: ${key}`);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinioBootstrapService,
        {
          provide: MINIO_CONNECTION,
          useValue: minioClientMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<MinioBootstrapService>(MinioBootstrapService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create bucket when bucket does not exist', async () => {
    minioClientMock.bucketExists.mockResolvedValue(false);
    minioClientMock.makeBucket.mockResolvedValue(undefined);

    await service.onApplicationBootstrap();

    expect(minioClientMock.bucketExists).toHaveBeenCalledWith('skybrain');
    expect(minioClientMock.makeBucket).toHaveBeenCalledWith('skybrain');
  });

  it('should not create bucket when bucket already exists', async () => {
    minioClientMock.bucketExists.mockResolvedValue(true);

    await service.onApplicationBootstrap();

    expect(minioClientMock.bucketExists).toHaveBeenCalledWith('skybrain');
    expect(minioClientMock.makeBucket).not.toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException when checking bucket fails', async () => {
    minioClientMock.bucketExists.mockRejectedValue(new Error('minio down'));

    await expect(service.onApplicationBootstrap()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should ignore create bucket race condition errors', async () => {
    minioClientMock.bucketExists.mockResolvedValue(false);
    minioClientMock.makeBucket.mockRejectedValue({
      code: 'BucketAlreadyOwnedByYou',
    });

    await expect(service.onApplicationBootstrap()).resolves.not.toThrow();
  });
});