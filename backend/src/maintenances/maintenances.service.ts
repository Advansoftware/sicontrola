import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MaintenancesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MaintenanceUncheckedCreateInput) {
    return this.prisma.maintenance.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.maintenance.findMany({
      include: {
        vehicle: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.maintenance.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.maintenance.delete({
      where: { id },
    });
  }
}
