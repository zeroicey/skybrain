import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { DronesService } from './drones.service';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';

@Controller('drones')
export class DronesController {
  private readonly logger = new Logger(DronesController.name);

  constructor(private readonly dronesService: DronesService) {}

  @Post()
  create(@Body() createDroneDto: CreateDroneDto) {
    this.logger.debug('Create drone request received');
    return this.dronesService.create(createDroneDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    this.logger.debug(`List drones request received page=${page}, limit=${limit}`);
    return this.dronesService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Get drone request received id=${id}`);
    return this.dronesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDroneDto: UpdateDroneDto,
  ) {
    this.logger.debug(`Update drone request received id=${id}`);
    return this.dronesService.update(id, updateDroneDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.debug(`Delete drone request received id=${id}`);
    return this.dronesService.remove(id);
  }
}
