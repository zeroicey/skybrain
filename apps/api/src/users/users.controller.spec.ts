import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const usersServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service create', async () => {
    const dto: CreateUserDto = {
      email: 'pilot@example.com',
      name: 'Pilot One',
    };
    usersServiceMock.create.mockResolvedValue({ id: 1, ...dto });

    await controller.create(dto);

    expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should call service findAll', async () => {
    const page = 1;
    const limit = 20;
    usersServiceMock.findAll.mockResolvedValue([]);

    await controller.findAll(page, limit);

    expect(usersServiceMock.findAll).toHaveBeenCalledWith(page, limit);
  });

  it('should call service findOne', async () => {
    const id = 1;
    usersServiceMock.findOne.mockResolvedValue({ id });

    await controller.findOne(id);

    expect(usersServiceMock.findOne).toHaveBeenCalledWith(id);
  });

  it('should call service update', async () => {
    const id = 1;
    const dto: UpdateUserDto = { name: 'Pilot Two' };
    usersServiceMock.update.mockResolvedValue({ id, ...dto });

    await controller.update(id, dto);

    expect(usersServiceMock.update).toHaveBeenCalledWith(id, dto);
  });

  it('should call service remove', async () => {
    const id = 1;
    usersServiceMock.remove.mockResolvedValue({ id });

    await controller.remove(id);

    expect(usersServiceMock.remove).toHaveBeenCalledWith(id);
  });
});
