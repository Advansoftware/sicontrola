import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentStatus } from '@prisma/client';
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

const STATUS_MAP: Record<string, StudentStatus[]> = {
  pending: ['PENDENTE', 'EM_ANALISE'],
  approved: ['APROVADO'],
  rejected: ['REPROVADO'],
  correction: ['EM_CORRECAO'],
  all: ['PENDENTE', 'EM_ANALISE', 'APROVADO', 'REPROVADO', 'EM_CORRECAO'],
};

@Injectable()
export class SecretaryService {
  constructor(private readonly prisma: PrismaService) { }

  async findStudents(status?: string, search?: string) {
    const statuses = STATUS_MAP[status ?? 'all'] ?? STATUS_MAP['all'];

    const where: Record<string, unknown> = {
      status: { in: statuses },
    };

    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { cpf: { contains: search } },
      ];
    }

    return this.prisma.student.findMany({
      where,
      include: {
        user: true,
        school: true,
        plan: true,
        documents: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // kept for backwards compatibility
  findPendingStudents() {
    return this.findStudents('pending');
  }

  async updateStatus(studentId: string, status: StudentStatus, reason?: string) {
    const student = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Estudante não encontrado');

    // Generate QR code on approval
    const qrCode =
      status === 'APROVADO' && !student.qrCode
        ? `CARD-${Date.now()}-${studentId.slice(-4).toUpperCase()}`
        : undefined;

    return this.prisma.student.update({
      where: { id: studentId },
      data: {
        status,
        rejectionReason:
          status === 'REPROVADO' || status === 'EM_CORRECAO' ? reason ?? null : null,
        ...(qrCode ? { qrCode } : {}),
      },
      include: { user: true, school: true, plan: true },
    });
  }

  async getDashboardStats() {
    const now = new Date();

    const [total, approved, pending, rejected, correction, monthlyRevenue, boardingsToday] =
      await Promise.all([
        this.prisma.student.count(),
        this.prisma.student.count({ where: { status: 'APROVADO' } }),
        this.prisma.student.count({ where: { status: 'PENDENTE' } }),
        this.prisma.student.count({ where: { status: 'REPROVADO' } }),
        this.prisma.student.count({ where: { status: 'EM_CORRECAO' } }),
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: 'PAGO',
            paidDate: { gte: startOfMonth(now), lte: endOfMonth(now) },
          },
        }),
        this.prisma.studentUsage.count({
          where: { date: { gte: startOfDay(now), lte: endOfDay(now) } },
        }),
      ]);

    return {
      totalStudents: total,
      approvedStudents: approved,
      pendingStudents: pending,
      rejectedStudents: rejected,
      correctionStudents: correction,
      monthlyRevenue: monthlyRevenue._sum.amount ?? 0,
      boardingsToday,
    };
  }
}

