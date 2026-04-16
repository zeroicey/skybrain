import { Test, TestingModule } from '@nestjs/testing';
import { DronesService } from './drones.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';

describe('DronesService', () => {
  let service: DronesService;
  const prismaServiceMock = {
    drone: {
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
        DronesService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<DronesService>(DronesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a drone', async () => {
    const dto: CreateDroneDto = { name: 'SkyEye', model: 'X-1' };
    prismaServiceMock.drone.create.mockResolvedValue({
      id: 'drone-id',
      ...dto,
    });

    await service.create(dto);

    expect(prismaServiceMock.drone.create).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        model: dto.model,
      },
    });
  });

  it('should return all drones ordered by createdAt desc', async () => {
    prismaServiceMock.drone.findMany.mockResolvedValue([]);

    await service.findAll(1, 20);

    expect(prismaServiceMock.drone.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0,
      take: 20,
    });
  });

  it('should clamp pagination values', async () => {
    prismaServiceMock.drone.findMany.mockResolvedValue([]);

    await service.findAll(0, 999);

    expect(prismaServiceMock.drone.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0,
      take: 100,
    });
  });

  it('should return one drone by id', async () => {
    const id = '64ff0662-0500-4c15-8518-789f9e9df0cd';
    prismaServiceMock.drone.findUnique.mockResolvedValue({
      id,
      name: 'SkyEye',
      model: 'X-1',
    });

    await service.findOne(id);

    expect(prismaServiceMock.drone.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should throw NotFoundException when drone is missing', async () => {
    const id = '64ff0662-0500-4c15-8518-789f9e9df0cd';
    prismaServiceMock.drone.findUnique.mockResolvedValue(null);

    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
  });

  it('should update a drone', async () => {
    const id = '64ff0662-0500-4c15-8518-789f9e9df0cd';
    const dto: UpdateDroneDto = { model: 'X-2' };
    prismaServiceMock.drone.update.mockResolvedValue({
      id,
      name: 'SkyEye',
      model: 'X-2',
    });

    await service.update(id, dto);

    expect(prismaServiceMock.drone.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        model: dto.model,
      },
    });
  });

  it('should throw NotFoundException on update when prisma reports missing record', async () => {
    const id = '64ff0662-0500-4c15-8518-789f9e9df0cd';
    prismaServiceMock.drone.update.mockRejectedValue({ code: 'P2025' });

    await expect(service.update(id, { model: 'X-2' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a drone', async () => {
    const id = '64ff0662-0500-4c15-8518-789f9e9df0cd';
    prismaServiceMock.drone.delete.mockResolvedValue({
      id,
      name: 'SkyEye',
      model: 'X-1',
    });

    await service.remove(id);

    expect(prismaServiceMock.drone.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it('should throw NotFoundException on remove when prisma reports missing record', async () => {
    const id = '64ff0662-0500-4c15-8518-789f9e9df0cd';
    prismaServiceMock.drone.delete.mockRejectedValue({ code: 'P2025' });

    await expect(service.remove(id)).rejects.toThrow(NotFoundException);
  });
});
