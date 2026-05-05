import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek } from 'date-fns';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) { }

  async getStudentsReport() {
    const [total, approved, pending, rejected, correction, students] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.count({ where: { status: 'APROVADO' } }),
      this.prisma.student.count({ where: { status: 'PENDENTE' } }),
      this.prisma.student.count({ where: { status: 'REPROVADO' } }),
      this.prisma.student.count({ where: { status: 'EM_CORRECAO' } }),
      this.prisma.student.findMany({
        include: { user: true, school: true, plan: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      summary: { total, approved, pending, rejected, correction },
      students: students.map((s) => ({
        id: s.id,
        name: s.user?.name,
        email: s.user?.email,
        school: s.school?.name,
        plan: s.plan?.name,
        status: s.status,
        createdAt: s.createdAt,
      })),
      byStatus: [
        { name: 'Aprovados', value: approved },
        { name: 'Pendentes', value: pending },
        { name: 'Reprovados', value: rejected },
        { name: 'Em Correção', value: correction },
      ],
    };
  }

  async getFinancialReport() {
    const now = new Date();

    // Last 6 months revenue
    const monthlyRevenue: { month: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const start = startOfMonth(d);
      const end = endOfMonth(d);
      const agg = await this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PAGO', paidDate: { gte: start, lte: end } },
      });
      monthlyRevenue.push({
        month: d.toLocaleString('pt-BR', { month: 'short' }),
        value: agg._sum.amount ?? 0,
      });
    }

    const [totalRevenue, pendingCount, overdueCount, planDist] = await Promise.all([
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PAGO' },
      }),
      this.prisma.payment.count({ where: { status: 'PENDENTE' } }),
      this.prisma.payment.count({ where: { status: 'ATRASADO' } }),
      this.prisma.plan.findMany({
        include: { _count: { select: { students: true } } },
      }),
    ]);

    const overdueStudents = await this.prisma.student.findMany({
      where: {
        payments: { some: { status: 'ATRASADO' } },
      },
      include: { user: true, plan: true, payments: { where: { status: 'ATRASADO' } } },
    });

    return {
      summary: {
        totalRevenue: totalRevenue._sum.amount ?? 0,
        pendingCount,
        overdueCount,
      },
      monthlyRevenue,
      planDistribution: planDist.map((p) => ({
        name: p.name,
        value: p._count.students,
      })),
      overdueStudents: overdueStudents.map((s) => ({
        id: s.id,
        name: s.user?.name,
        plan: s.plan?.name,
        amount: s.payments[0]?.amount,
        dueDate: s.payments[0]?.dueDate,
      })),
    };
  }

  async getUsageReport() {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Usage by day of week (current week)
    const usages = await this.prisma.studentUsage.findMany({
      where: { date: { gte: weekStart, lte: weekEnd } },
      include: { route: true },
    });

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const byDay: Record<string, number> = {};
    dayNames.forEach((d) => (byDay[d] = 0));
    usages.forEach((u) => {
      const day = dayNames[new Date(u.date).getDay()];
      byDay[day] = (byDay[day] ?? 0) + 1;
    });

    // Usage by route
    const routeCounts: Record<string, number> = {};
    usages.forEach((u) => {
      const name = u.route?.name ?? 'Sem rota';
      routeCounts[name] = (routeCounts[name] ?? 0) + 1;
    });

    // Weekly usage per student
    const students = await this.prisma.student.findMany({
      where: { status: 'APROVADO' },
      include: {
        user: true,
        plan: true,
        usages: { where: { date: { gte: weekStart, lte: weekEnd } } },
      },
    });

    return {
      byDay: dayNames.map((d) => ({ name: d, value: byDay[d] })),
      byRoute: Object.entries(routeCounts).map(([name, value]) => ({ name, value })),
      weeklyUsagePerStudent: students.map((s) => ({
        id: s.id,
        name: s.user?.name,
        plan: s.plan?.name,
        usesPerWeek: s.plan?.usesPerWeek ?? 0,
        usedThisWeek: s.usages.length,
      })),
    };
  }
}
