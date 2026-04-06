import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RevisionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.RevisionUncheckedCreateInput) {
    return this.prisma.revision.create({
      data,
      include: { vehicle: true },
    });
  }

  async findAll() {
    return this.prisma.revision.findMany({
      include: { vehicle: true },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.revision.findUnique({
      where: { id },
      include: { vehicle: true },
    });
  }

  async update(id: string, data: Prisma.RevisionUpdateInput) {
    return this.prisma.revision.update({
      where: { id },
      data,
      include: { vehicle: true },
    });
  }

  async remove(id: string) {
    return this.prisma.revision.delete({
      where: { id },
    });
  }
}
