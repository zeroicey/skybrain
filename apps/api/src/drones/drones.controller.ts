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
} from '@nestjs/common';
import { DronesService } from './drones.service';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';

@Controller('drones')
export class DronesController {
  constructor(private readonly dronesService: DronesService) {}

  @Post()
  create(@Body() createDroneDto: CreateDroneDto) {
    return this.dronesService.create(createDroneDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.dronesService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.dronesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDroneDto: UpdateDroneDto,
  ) {
    return this.dronesService.update(id, updateDroneDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.dronesService.remove(id);
  }
}
