import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    const databaseUrl = configService.getOrThrow<string>('database.url');
    const adapter = new PrismaPg({ connectionString: databaseUrl });
    super({ adapter });
  }
}
