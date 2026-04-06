import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DriverCreateInput) {
    return this.prisma.driver.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.driver.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.driver.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.DriverUpdateInput) {
    return this.prisma.driver.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.driver.delete({
      where: { id },
    });
  }
}
