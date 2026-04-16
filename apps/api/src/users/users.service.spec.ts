import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  const prismaServiceMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      email: 'pilot@example.com',
      name: 'Pilot One',
    };
    prismaServiceMock.user.create.mockResolvedValue({ id: 1, ...dto });

    await service.create(dto);

    expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
      data: {
        email: dto.email,
        name: dto.name,
      },
    });
  });

  it('should throw ConflictException when email already exists on create', async () => {
    prismaServiceMock.user.create.mockRejectedValue({
      code: 'P2002',
      meta: { target: ['email'] },
    });

    await expect(
      service.create({ email: 'pilot@example.com', name: 'Pilot One' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should return all users ordered by createdAt desc', async () => {
    prismaServiceMock.user.findMany.mockResolvedValue([]);

    await service.findAll(1, 20);

    expect(prismaServiceMock.user.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0,
      take: 20,
    });
  });

  it('should clamp pagination values', async () => {
    prismaServiceMock.user.findMany.mockResolvedValue([]);

    await service.findAll(0, 999);

    expect(prismaServiceMock.user.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0,
      take: 100,
    });
  });

  it('should return one user by id', async () => {
    const id = 1;
    prismaServiceMock.user.findUnique.mockResolvedValue({
      id,
      email: 'pilot@example.com',
      name: 'Pilot One',
    });

    await service.findOne(id);

    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should throw NotFoundException when user is missing', async () => {
    const id = 1;
    prismaServiceMock.user.findUnique.mockResolvedValue(null);

    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    const id = 1;
    const dto: UpdateUserDto = { name: 'Pilot Two' };
    prismaServiceMock.user.update.mockResolvedValue({
      id,
      email: 'pilot@example.com',
      name: 'Pilot Two',
    });

    await service.update(id, dto);

    expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  });

  it('should throw NotFoundException on update when prisma reports missing record', async () => {
    const id = 1;
    prismaServiceMock.user.update.mockRejectedValue({ code: 'P2025' });

    await expect(service.update(id, { name: 'Pilot Two' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ConflictException on update when email already exists', async () => {
    const id = 1;
    prismaServiceMock.user.update.mockRejectedValue({
      code: 'P2002',
      meta: { target: ['email'] },
    });

    await expect(
      service.update(id, { email: 'pilot@example.com' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw BadRequestException on update when payload is empty', async () => {
    const id = 1;

    await expect(service.update(id, {})).rejects.toThrow(BadRequestException);
    expect(prismaServiceMock.user.update).not.toHaveBeenCalled();
  });

  it('should remove a user', async () => {
    const id = 1;
    prismaServiceMock.user.delete.mockResolvedValue({
      id,
      email: 'pilot@example.com',
      name: 'Pilot One',
    });

    await service.remove(id);

    expect(prismaServiceMock.user.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should throw NotFoundException on remove when prisma reports missing record', async () => {
    const id = 1;
    prismaServiceMock.user.delete.mockRejectedValue({ code: 'P2025' });

    await expect(service.remove(id)).rejects.toThrow(NotFoundException);
  });
});
