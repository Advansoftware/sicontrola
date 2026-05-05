import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class UsageService {
  constructor(private readonly prisma: PrismaService) { }

  async validateAndRegister(qrCode: string, userId: string) {
    // 1. Get driver profile
    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    if (!driver) {
      throw new ForbiddenException('Apenas motoristas podem validar embarques');
    }

    // 2. Find student by QR Code
    const student = await this.prisma.student.findUnique({
      where: { qrCode },
      include: { plan: true, user: true },
    });

    if (!student) {
      throw new NotFoundException('Estudante não encontrado ou QR Code inválido');
    }

    // 3. Check approval status
    if (student.status !== 'APROVADO') {
      return {
        allowed: false,
        reason: `Status do estudante: ${student.status}`,
        student: { name: student.user?.name, qrCode: student.qrCode },
      };
    }

    // 4. Check payment
    const overduePayment = await this.prisma.payment.findFirst({
      where: { studentId: student.id, status: 'ATRASADO' },
    });
    if (overduePayment) {
      return {
        allowed: false,
        reason: 'Pagamento em atraso',
        student: { name: student.user?.name, qrCode: student.qrCode },
      };
    }

    // 5. Check weekly usage limit
    if (student.plan) {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

      const weeklyCount = await this.prisma.studentUsage.count({
        where: { studentId: student.id, date: { gte: weekStart, lte: weekEnd } },
      });

      if (weeklyCount >= student.plan.usesPerWeek) {
        return {
          allowed: false,
          reason: `Limite semanal de ${student.plan.usesPerWeek} usos atingido`,
          student: { name: student.user?.name, qrCode: student.qrCode },
          weeklyUsage: { used: weeklyCount, limit: student.plan.usesPerWeek },
        };
      }
    }

    // 6. Get or create route for this driver
    let route = await this.prisma.route.findFirst({ where: { driverId: driver.id } });
    if (!route) {
      route = await this.prisma.route.findFirst();
    }
    if (!route) {
      route = await this.prisma.route.create({
        data: { name: 'Rota Padrão', origin: 'Centro', destination: 'Escola' },
      });
    }

    // 7. Register usage
    const usage = await this.prisma.studentUsage.create({
      data: {
        studentId: student.id,
        driverId: driver.id,
        routeId: route.id,
        date: new Date(),
      },
      include: { route: true, driver: true },
    });

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const weeklyUsed = await this.prisma.studentUsage.count({
      where: { studentId: student.id, date: { gte: weekStart, lte: weekEnd } },
    });

    return {
      allowed: true,
      message: 'Embarque autorizado!',
      student: {
        id: student.id,
        name: student.user?.name,
        qrCode: student.qrCode,
        plan: student.plan?.name,
      },
      weeklyUsage: {
        used: weeklyUsed,
        limit: student.plan?.usesPerWeek ?? 0,
      },
      usage,
    };
  }

  async getDriverTodayRecords(userId: string) {
    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    if (!driver) throw new ForbiddenException('Perfil de motorista não encontrado');

    const now = new Date();
    const records = await this.prisma.studentUsage.findMany({
      where: {
        driverId: driver.id,
        date: { gte: startOfDay(now), lte: endOfDay(now) },
      },
      include: {
        student: {
          include: { user: true, plan: true },
        },
        route: true,
      },
      orderBy: { date: 'desc' },
    });

    const route = await this.prisma.route.findFirst({ where: { driverId: driver.id } });

    return {
      driver: { id: driver.id, name: driver.name },
      route: route ?? null,
      total: records.length,
      allowed: records.length, // all registered usages are allowed
      records: records.map((r) => ({
        id: r.id,
        time: r.date,
        studentName: r.student?.user?.name,
        plan: r.student?.plan?.name,
        route: r.route?.name,
        allowed: true,
      })),
    };
  }

  async getStudentWeekUsage(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: { plan: true },
    });
    if (!student) throw new NotFoundException('Estudante não encontrado');

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const usages = await this.prisma.studentUsage.findMany({
      where: { studentId: student.id, date: { gte: weekStart, lte: weekEnd } },
      include: { route: true, driver: true },
      orderBy: { date: 'desc' },
    });

    return {
      used: usages.length,
      limit: student.plan?.usesPerWeek ?? 0,
      planName: student.plan?.name,
      records: usages,
    };
  }
}

