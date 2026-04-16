import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DronesService {
  private static readonly DEFAULT_PAGE = 1;
  private static readonly DEFAULT_LIMIT = 20;
  private static readonly MAX_LIMIT = 100;

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

  create(createDroneDto: CreateDroneDto) {
    return this.prisma.drone.create({
      data: {
        name: createDroneDto.name,
        model: createDroneDto.model,
      },
    });
  }

  findAll(page?: number, limit?: number) {
    const { safeLimit, skip } = this.getSafePagination(page, limit);

    return this.prisma.drone.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: safeLimit,
    });
  }

  async findOne(id: string) {
    const drone = await this.prisma.drone.findUnique({
      where: { id },
    });

    if (!drone) {
      throw new NotFoundException(`Drone with id ${id} not found`);
    }

    return drone;
  }

  async update(id: string, updateDroneDto: UpdateDroneDto) {
    try {
      return await this.prisma.drone.update({
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
    } catch (error: unknown) {
      if (this.isPrismaNotFoundError(error)) {
        throw new NotFoundException(`Drone with id ${id} not found`);
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.drone.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (this.isPrismaNotFoundError(error)) {
        throw new NotFoundException(`Drone with id ${id} not found`);
      }

      throw error;
    }
  }
}
