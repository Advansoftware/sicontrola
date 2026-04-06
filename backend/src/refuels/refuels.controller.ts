import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RefuelsService } from './refuels.service';
import { Prisma } from '@prisma/client';

@Controller('api/refuels')
export class RefuelsController {
  constructor(private readonly refuelsService: RefuelsService) {}

  @Post()
  create(@Body() createRefuelDto: Prisma.RefuelUncheckedCreateInput) {
    return this.refuelsService.create(createRefuelDto);
  }

  @Get()
  findAll() {
    return this.refuelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refuelsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.refuelsService.remove(id);
  }
}
