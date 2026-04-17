import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(UsersService.name);

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
    this.logger.log('Creating user');
    try {
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
        },
      });

      this.logger.log(`User created: ${user.id}`);
      return user;
    } catch (error: unknown) {
      if (this.isPrismaEmailConflictError(error)) {
        this.logger.warn('User create failed, email already exists');
        throw new ConflictException('Email already exists');
      }

      this.logger.error(
        'User create failed',
        error instanceof Error ? error.stack : undefined,
      );

      throw error;
    }
  }

  findAll(page?: number, limit?: number) {
    const { safePage, safeLimit, skip } = this.getSafePagination(page, limit);
    this.logger.debug(
      `Listing users with pagination page=${safePage}, limit=${safeLimit}`,
    );

    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: safeLimit,
    });
  }

  async findOne(id: number) {
    this.logger.debug(`Finding user by id: ${id}`);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.logger.warn(`User not found: ${id}`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email === undefined && updateUserDto.name === undefined) {
      this.logger.warn(`User update failed, payload is empty: ${id}`);
      throw new BadRequestException('At least one field must be provided');
    }

    this.logger.log(`Updating user: ${id}`);

    try {
      const user = await this.prisma.user.update({
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

      this.logger.log(`User updated: ${id}`);
      return user;
    } catch (error: unknown) {
      if (this.isPrismaNotFoundError(error)) {
        this.logger.warn(`User update failed, not found: ${id}`);
        throw new NotFoundException(`User with id ${id} not found`);
      }

      if (this.isPrismaEmailConflictError(error)) {
        this.logger.warn(`User update failed, email conflict: ${id}`);
        throw new ConflictException('Email already exists');
      }

      this.logger.error(
        `User update failed: ${id}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw error;
    }
  }

  async remove(id: number) {
    this.logger.log(`Removing user: ${id}`);
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });

      this.logger.log(`User removed: ${id}`);
      return user;
    } catch (error: unknown) {
      if (this.isPrismaNotFoundError(error)) {
        this.logger.warn(`User remove failed, not found: ${id}`);
        throw new NotFoundException(`User with id ${id} not found`);
      }

      this.logger.error(
        `User remove failed: ${id}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw error;
    }
  }
}
