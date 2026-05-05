import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) { }

  async createPayment(
    userId: string,
    amount: number,
    method: string,
    transactionId?: string,
  ) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Estudante não encontrado');

    return this.prisma.payment.create({
      data: {
        studentId: student.id,
        amount,
        method,
        transactionId,
        status: 'PAGO',
        dueDate: new Date(),
        paidDate: new Date(),
      },
    });
  }

  async getMyPayments(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        payments: { orderBy: { createdAt: 'desc' } },
        plan: true,
      },
    });
    if (!student) throw new NotFoundException('Estudante não encontrado');
    return { payments: student.payments, plan: student.plan };
  }

  async getStudentsWithPayments(filter?: string, search?: string) {
    const where: Record<string, unknown> = { status: 'APROVADO' };

    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { cpf: { contains: search } },
      ];
    }

    const students = await this.prisma.student.findMany({
      where,
      include: {
        user: true,
        plan: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = students.map((s) => {
      const lastPayment = s.payments[0];
      return {
        id: s.id,
        name: s.user?.name,
        cpf: s.cpf,
        email: s.user?.email,
        plan: s.plan?.name,
        planPrice: s.plan?.price,
        paymentStatus: lastPayment?.status ?? 'PENDENTE',
        lastPaymentDate: lastPayment?.paidDate ?? null,
        dueDate: lastPayment?.dueDate ?? null,
      };
    });

    if (filter && filter !== 'all') {
      const statusMap: Record<string, string> = {
        paid: 'PAGO',
        pending: 'PENDENTE',
        overdue: 'ATRASADO',
      };
      return enriched.filter((s) => s.paymentStatus === (statusMap[filter] ?? filter));
    }

    return enriched;
  }

  async adminCreatePayment(studentId: string, amount: number, method: string) {
    const student = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Estudante não encontrado');

    return this.prisma.payment.create({
      data: {
        studentId,
        amount,
        method,
        status: 'PAGO',
        dueDate: new Date(),
        paidDate: new Date(),
      },
    });
  }

  async getGlobalStats() {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const [totalRevenue, monthlyRevenue, pendingCount, overdueCount, activeStudents] =
      await Promise.all([
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'PAGO' },
        }),
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'PAGO', paidDate: { gte: monthStart, lte: monthEnd } },
        }),
        this.prisma.payment.count({ where: { status: 'PENDENTE' } }),
        this.prisma.payment.count({ where: { status: 'ATRASADO' } }),
        this.prisma.student.count({ where: { status: 'APROVADO' } }),
      ]);

    const pendingTotal = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'PENDENTE' },
    });
    const overdueTotal = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'ATRASADO' },
    });

    return {
      totalRevenue: totalRevenue._sum.amount ?? 0,
      monthlyRevenue: monthlyRevenue._sum.amount ?? 0,
      pendingCount,
      pendingTotal: pendingTotal._sum.amount ?? 0,
      overdueCount,
      overdueTotal: overdueTotal._sum.amount ?? 0,
      activeStudents,
    };
  }
}

