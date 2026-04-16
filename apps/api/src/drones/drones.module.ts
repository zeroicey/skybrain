import { Module } from '@nestjs/common';
import { DronesService } from './drones.service';
import { DronesController } from './drones.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DronesController],
  providers: [DronesService, PrismaService],
})
export class DronesModule {}
