import { Test, TestingModule } from '@nestjs/testing';
import { DronesController } from './drones.controller';
import { DronesService } from './drones.service';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';

describe('DronesController', () => {
  let controller: DronesController;
  const dronesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DronesController],
      providers: [
        {
          provide: DronesService,
          useValue: dronesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<DronesController>(DronesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service create', async () => {
    const dto: CreateDroneDto = { name: 'SkyEye', model: 'X-1' };
    dronesServiceMock.create.mockResolvedValue({ id: 'drone-id', ...dto });

    await controller.create(dto);

    expect(dronesServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should call service findAll', async () => {
    const page = 1;
    const limit = 20;
    dronesServiceMock.findAll.mockResolvedValue([]);

    await controller.findAll(page, limit);

    expect(dronesServiceMock.findAll).toHaveBeenCalledWith(page, limit);
  });

  it('should call service findOne', async () => {
    const id = '64ff0662-0500-4c15-8518-789f9e9df0cd';
    dronesServiceMock.findOne.mockResolvedValue({ id });

    await controller.findOne(id);

    expect(dronesServiceMock.findOne).toHaveBeenCalledWith(id);
  });

  it('should call service update', async () => {
    const id = '64ff0662-0500-4c15-8518-789f9e9df0cd';
    const dto: UpdateDroneDto = { model: 'X-2' };
    dronesServiceMock.update.mockResolvedValue({ id, ...dto });

    await controller.update(id, dto);

    expect(dronesServiceMock.update).toHaveBeenCalledWith(id, dto);
  });

  it('should call service remove', async () => {
    const id = '64ff0662-0500-4c15-8518-789f9e9df0cd';
    dronesServiceMock.remove.mockResolvedValue({ id });

    await controller.remove(id);

    expect(dronesServiceMock.remove).toHaveBeenCalledWith(id);
  });
});
