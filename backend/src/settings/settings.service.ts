import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) { }

  // ── Schools ──────────────────────────────────────────────

  getSchools() {
    return this.prisma.school.findMany({ orderBy: { name: 'asc' } });
  }

  createSchool(name: string, address: string) {
    return this.prisma.school.create({ data: { name, address } });
  }

  async deleteSchool(id: string) {
    await this.prisma.school.findUniqueOrThrow({ where: { id } });
    return this.prisma.school.delete({ where: { id } });
  }

  // ── Routes ───────────────────────────────────────────────

  getRoutes() {
    return this.prisma.route.findMany({
      include: { driver: true },
      orderBy: { name: 'asc' },
    });
  }

  createRoute(data: { name: string; origin: string; destination: string; description?: string }) {
    return this.prisma.route.create({ data });
  }

  async deleteRoute(id: string) {
    await this.prisma.route.findUniqueOrThrow({ where: { id } });
    return this.prisma.route.delete({ where: { id } });
  }

  // ── Plans ────────────────────────────────────────────────

  getPlans() {
    return this.prisma.plan.findMany({ orderBy: { price: 'asc' } });
  }

  async updatePlan(id: string, data: { price?: number; usesPerWeek?: number; description?: string }) {
    await this.prisma.plan.findUniqueOrThrow({ where: { id } });
    return this.prisma.plan.update({ where: { id }, data });
  }

  // ── System Settings ──────────────────────────────────────

  async getSystemSettings() {
    const settings = await this.prisma.systemSettings.findUnique({
      where: { id: 'default' },
    });
    if (!settings) {
      return this.prisma.systemSettings.create({ data: { id: 'default' } });
    }
    return settings;
  }

  async updateSystemSettings(data: Record<string, unknown>) {
    return this.prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: data as Parameters<typeof this.prisma.systemSettings.update>[0]['data'],
      create: Object.assign({ id: 'default' }, data) as Parameters<typeof this.prisma.systemSettings.create>[0]['data'],
    });
  }
}
