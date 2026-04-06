import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RevisionsService } from './revisions.service';
import { Prisma } from '@prisma/client';

@Controller('api/revisions')
export class RevisionsController {
  constructor(private readonly revisionsService: RevisionsService) {}

  @Post()
  create(@Body() createRevisionDto: Prisma.RevisionUncheckedCreateInput) {
    return this.revisionsService.create(createRevisionDto);
  }

  @Get()
  findAll() {
    return this.revisionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.revisionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRevisionDto: Prisma.RevisionUpdateInput) {
    return this.revisionsService.update(id, updateRevisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.revisionsService.remove(id);
  }
}
