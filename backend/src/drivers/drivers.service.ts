import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateDriverDto {
  name: string;
  cnh: string;
  category: string;
  validity: string;
  routeId?: string;
  userId?: string;
}

interface UpdateDriverDto {
  name?: string;
  cnh?: string;
  category?: string;
  validity?: string;
  routeId?: string;
}

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) { }

  create(data: CreateDriverDto) {
    return this.prisma.driver.create({
      data: {
        name: data.name,
        cnh: data.cnh,
        category: data.category,
        validity: new Date(data.validity),
        userId: data.userId,
      },
      include: { routes: true },
    });
  }

  findAll() {
    return this.prisma.driver.findMany({
      include: { routes: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      include: { routes: true },
    });
    if (!driver) throw new NotFoundException('Motorista não encontrado');
    return driver;
  }

  async update(id: string, data: UpdateDriverDto) {
    await this.findOne(id);

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.cnh !== undefined) updateData.cnh = data.cnh;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.validity !== undefined) updateData.validity = new Date(data.validity);

    // If routeId changes, update the route's driverId
    if (data.routeId !== undefined) {
      // Unassign current routes of this driver
      await this.prisma.route.updateMany({
        where: { driverId: id },
        data: { driverId: null },
      });
      // Assign new route
      if (data.routeId) {
        await this.prisma.route.update({
          where: { id: data.routeId },
          data: { driverId: id },
        });
      }
    }

    return this.prisma.driver.update({
      where: { id },
      data: updateData,
      include: { routes: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Unassign routes before deleting
    await this.prisma.route.updateMany({
      where: { driverId: id },
      data: { driverId: null },
    });
    return this.prisma.driver.delete({ where: { id } });
  }
}

