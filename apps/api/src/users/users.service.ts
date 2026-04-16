import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  private static readonly DEFAULT_PAGE = 1;
  private static readonly DEFAULT_LIMIT = 20;
  private static readonly MAX_LIMIT = 100;

  constructor(private readonly prisma: PrismaService) {}

  private getSafePagination(page?: number, limit?: number) {
    const safePage = Math.max(page ?? UsersService.DEFAULT_PAGE, 1);
    const requestedLimit = limit ?? UsersService.DEFAULT_LIMIT;
    const safeLimit = Math.min(
      Math.max(requestedLimit, 1),
      UsersService.MAX_LIMIT,
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

  private isPrismaEmailConflictError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    if (!('code' in error) || (error as { code?: string }).code !== 'P2002') {
      return false;
    }

    if (!('meta' in error)) {
      return false;
    }

    const meta = (error as { meta?: { target?: unknown } }).meta;
    const target = meta?.target;
    return Array.isArray(target) && target.includes('email');
  }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
        },
      });
    } catch (error: unknown) {
      if (this.isPrismaEmailConflictError(error)) {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

  findAll(page?: number, limit?: number) {
    const { safeLimit, skip } = this.getSafePagination(page, limit);

    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: safeLimit,
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email === undefined && updateUserDto.name === undefined) {
      throw new BadRequestException('At least one field must be provided');
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...(updateUserDto.email !== undefined && {
            email: updateUserDto.email,
          }),
          ...(updateUserDto.name !== undefined && {
            name: updateUserDto.name,
          }),
        },
      });
    } catch (error: unknown) {
      if (this.isPrismaNotFoundError(error)) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      if (this.isPrismaEmailConflictError(error)) {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (this.isPrismaNotFoundError(error)) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      throw error;
    }
  }
}
