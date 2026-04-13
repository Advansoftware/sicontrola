import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentStatus } from '@prisma/client';

@Injectable()
export class SecretaryService {
  constructor(private readonly prisma: PrismaService) {}

  async findPendingStudents() {
    return this.prisma.student.findMany({
      where: {
        status: { in: ['PENDENTE', 'EM_ANALISE', 'EM_CORRECAO'] },
      },
      include: {
        user: true,
        school: true,
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(studentId: string, status: StudentStatus, rejectionReason?: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Estudante não encontrado');
    }

    return this.prisma.student.update({
      where: { id: studentId },
      data: {
        status,
        rejectionReason: status === 'REPROVADO' || status === 'EM_CORRECAO' ? rejectionReason : null,
      },
    });
  }

  async getDashboardStats() {
    const totalStudents = await this.prisma.student.count();
    const pendingAnalysis = await this.prisma.student.count({
      where: { status: 'PENDENTE' },
    });
    const approved = await this.prisma.student.count({
      where: { status: 'APROVADO' },
    });

    return {
      totalStudents,
      pendingAnalysis,
      approved,
    };
  }
}
