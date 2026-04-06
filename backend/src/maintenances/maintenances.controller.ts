import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MaintenancesService } from './maintenances.service';
import { Prisma } from '@prisma/client';

@Controller('api/maintenances')
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) {}

  @Post()
  create(@Body() createMaintenanceDto: Prisma.MaintenanceUncheckedCreateInput) {
    return this.maintenancesService.create(createMaintenanceDto);
  }

  @Get()
  findAll() {
    return this.maintenancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenancesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maintenancesService.remove(id);
  }
}
