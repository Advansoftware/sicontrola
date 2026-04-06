import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinesService } from './fines.service';
import { Prisma } from '@prisma/client';

@Controller('api/fines')
export class FinesController {
  constructor(private readonly finesService: FinesService) {}

  @Post()
  create(@Body() createFineDto: Prisma.FineUncheckedCreateInput) {
    return this.finesService.create(createFineDto);
  }

  @Get()
  findAll() {
    return this.finesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFineDto: Prisma.FineUpdateInput) {
    return this.finesService.update(id, updateFineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finesService.remove(id);
  }
}
