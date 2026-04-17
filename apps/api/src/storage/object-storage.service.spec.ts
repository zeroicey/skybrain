import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { ObjectStorageService } from './object-storage.service';

describe('ObjectStorageService', () => {
  let service: ObjectStorageService;

  const minioClientMock = {
    putObject: jest.fn(),
    getObject: jest.fn(),
    removeObject: jest.fn(),
    presignedGetObject: jest.fn(),
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
        ObjectStorageService,
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

    service = module.get<ObjectStorageService>(ObjectStorageService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload object to default bucket', async () => {
    minioClientMock.putObject.mockResolvedValue('etag-123');

    const result = await service.uploadObject({
      objectName: 'demo.txt',
      data: Buffer.from('hello'),
      metaData: { 'Content-Type': 'text/plain' },
    });

    expect(minioClientMock.putObject).toHaveBeenCalledWith(
      'skybrain',
      'demo.txt',
      expect.any(Buffer),
      undefined,
      { 'Content-Type': 'text/plain' },
    );
    expect(result).toEqual({
      bucketName: 'skybrain',
      objectName: 'demo.txt',
      etag: 'etag-123',
    });
  });

  it('should throw BadRequestException when objectName is empty', async () => {
    await expect(
      service.uploadObject({
        objectName: '   ',
        data: Buffer.from('hello'),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when objectName contains invalid characters', async () => {
    await expect(
      service.uploadObject({
        objectName: '../secret.txt',
        data: Buffer.from('hello'),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when getObject returns NoSuchKey', async () => {
    minioClientMock.getObject.mockRejectedValue({ code: 'NoSuchKey' });

    await expect(service.getObjectStream('missing.txt')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove object from overridden bucket', async () => {
    minioClientMock.removeObject.mockResolvedValue(undefined);

    await service.removeObject('demo.txt', 'custom-bucket');

    expect(minioClientMock.removeObject).toHaveBeenCalledWith(
      'custom-bucket',
      'demo.txt',
    );
  });

  it('should return presigned download url', async () => {
    minioClientMock.presignedGetObject.mockResolvedValue(
      'https://example.com/signed-url',
    );

    const url = await service.getPresignedGetUrl('demo.txt', 600);

    expect(minioClientMock.presignedGetObject).toHaveBeenCalledWith(
      'skybrain',
      'demo.txt',
      600,
    );
    expect(url).toBe('https://example.com/signed-url');
  });

  it('should throw BadRequestException when expiresInSeconds is out of range', async () => {
    await expect(service.getPresignedGetUrl('demo.txt', 0)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.getPresignedGetUrl('demo.txt', 7200)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw InternalServerErrorException when upload fails unexpectedly', async () => {
    minioClientMock.putObject.mockRejectedValue(new Error('minio down'));

    await expect(
      service.uploadObject({
        objectName: 'demo.txt',
        data: Buffer.from('hello'),
      }),
    ).rejects.toThrow(InternalServerErrorException);
  });
});