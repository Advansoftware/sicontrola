import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(userId: string, amount: number, method: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Estudante não encontrado');
    }

    return this.prisma.payment.create({
      data: {
        studentId: student.id,
        amount,
        method,
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
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Estudante não encontrado');
    }

    return student.payments;
  }

  async getGlobalStats() {
    const totalRevenue = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'PAGO' },
    });

    const pendingPayments = await this.prisma.payment.count({
      where: { status: 'PENDENTE' },
    });

    return {
      totalRevenue: totalRevenue._sum?.amount || 0,
      pendingPayments,
    };
  }
}
