import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RefuelsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.RefuelUncheckedCreateInput) {
    // Atualiza o KM do veículo ao abastecer
    await this.prisma.vehicle.update({
      where: { id: data.vehicleId },
      data: { currentKM: data.currentKM },
    });

    return this.prisma.refuel.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.refuel.findMany({
      include: {
        vehicle: true,
        driver: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.refuel.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.refuel.delete({
      where: { id },
    });
  }
}
