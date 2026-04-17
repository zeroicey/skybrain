import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DronesService {
  private static readonly DEFAULT_PAGE = 1;
  private static readonly DEFAULT_LIMIT = 20;
  private static readonly MAX_LIMIT = 100;
  private readonly logger = new Logger(DronesService.name);

  constructor(private readonly prisma: PrismaService) {}

  private getSafePagination(page?: number, limit?: number) {
    const safePage = Math.max(page ?? DronesService.DEFAULT_PAGE, 1);
    const requestedLimit = limit ?? DronesService.DEFAULT_LIMIT;
    const safeLimit = Math.min(
      Math.max(requestedLimit, 1),
      DronesService.MAX_LIMIT,
    );

    return {
      safePage,
      safeLimit,
      skip: (safePage - 1) * safeLimit,
    };
  }

  private isPrismaNotFoundError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    return 'code' in error && (error as { code?: string }).code === 'P2025';
  }

  async create(createDroneDto: CreateDroneDto) {
    this.logger.log('Creating drone');

    const drone = await this.prisma.drone.create({
      data: {
        name: createDroneDto.name,
        model: createDroneDto.model,
      },
    });

    this.logger.log(`Drone created: ${drone.id}`);
    return drone;
  }

  findAll(page?: number, limit?: number) {
    const { safePage, safeLimit, skip } = this.getSafePagination(page, limit);
    this.logger.debug(
      `Listing drones with pagination page=${safePage}, limit=${safeLimit}`,
    );

    return this.prisma.drone.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: safeLimit,
    });
  }

  async findOne(id: string) {
    this.logger.debug(`Finding drone by id: ${id}`);
    const drone = await this.prisma.drone.findUnique({
      where: { id },
    });

    if (!drone) {
      this.logger.warn(`Drone not found: ${id}`);
      throw new NotFoundException(`Drone with id ${id} not found`);
    }

    return drone;
  }

  async update(id: string, updateDroneDto: UpdateDroneDto) {
    this.logger.log(`Updating drone: ${id}`);
    try {
      const drone = await this.prisma.drone.update({
        where: { id },
        data: {
          ...(updateDroneDto.name !== undefined && {
            name: updateDroneDto.name,
          }),
          ...(updateDroneDto.model !== undefined && {
            model: updateDroneDto.model,
          }),
        },
      });

      this.logger.log(`Drone updated: ${id}`);
      return drone;
    } catch (error: unknown) {
      if (this.isPrismaNotFoundError(error)) {
        this.logger.warn(`Drone update failed, not found: ${id}`);
        throw new NotFoundException(`Drone with id ${id} not found`);
      }

      this.logger.error(
        `Drone update failed: ${id}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw error;
    }
  }

  async remove(id: string) {
    this.logger.log(`Removing drone: ${id}`);
    try {
      const drone = await this.prisma.drone.delete({
        where: { id },
      });

      this.logger.log(`Drone removed: ${id}`);
      return drone;
    } catch (error: unknown) {
      if (this.isPrismaNotFoundError(error)) {
        this.logger.warn(`Drone remove failed, not found: ${id}`);
        throw new NotFoundException(`Drone with id ${id} not found`);
      }

      this.logger.error(
        `Drone remove failed: ${id}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw error;
    }
  }
}
