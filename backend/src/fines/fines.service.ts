import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FinesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.FineUncheckedCreateInput) {
    return this.prisma.fine.create({
      data,
      include: { vehicle: true },
    });
  }

  async findAll() {
    return this.prisma.fine.findMany({
      include: { vehicle: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.fine.findUnique({
      where: { id },
      include: { vehicle: true },
    });
  }

  async update(id: string, data: Prisma.FineUpdateInput) {
    return this.prisma.fine.update({
      where: { id },
      data,
      include: { vehicle: true },
    });
  }

  async remove(id: string) {
    return this.prisma.fine.delete({
      where: { id },
    });
  }
}
