import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/drivers')
@UseGuards(AuthGuard, RolesGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) { }

  @Post()
  @Roles('ADMIN')
  create(@Body() body: {
    name: string;
    cnh: string;
    category: string;
    validity: string;
    routeId?: string;
    userId?: string;
  }) {
    return this.driversService.create(body);
  }

  @Get()
  @Roles('ADMIN', 'SECRETARIA', 'MOTORISTA')
  findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'SECRETARIA')
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      cnh?: string;
      category?: string;
      validity?: string;
      routeId?: string;
    },
  ) {
    return this.driversService.update(id, body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.driversService.remove(id);
  }
}

