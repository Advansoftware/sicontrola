import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import 'multer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UploadsService } from '../uploads/uploads.service';
import { MailService } from '../mail/mail.service';
import { startOfWeek, endOfWeek } from 'date-fns';
import { StudentStatus } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploads: UploadsService,
    private readonly mail: MailService,
  ) { }

  async create(userId: string, createStudentDto: CreateStudentDto) {
    const existing = await this.prisma.student.findUnique({ where: { userId } });
    if (existing) {
      throw new ConflictException('Perfil de estudante já existe para este usuário');
    }

    const student = await this.prisma.student.create({
      data: {
        userId,
        cpf: createStudentDto.cpf,
        birthDate: new Date(createStudentDto.birthDate),
        phone: createStudentDto.phone,
        address: createStudentDto.address,
        bairro: createStudentDto.bairro,
        schoolId: createStudentDto.schoolId,
        course: createStudentDto.course,
        period: createStudentDto.period,
        schoolYear: createStudentDto.schoolYear,
        planId: createStudentDto.planId,
        status: 'PENDENTE',
      },
      include: { user: true },
    });

    this.mail
      .sendConfirmationEmail(student.user.email, student.user.name ?? student.user.email)
      .catch(console.error);

    return student;
  }

  async findMe(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: true,
        school: true,
        plan: true,
        documents: true,
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!student) throw new NotFoundException('Perfil de estudante não encontrado');
    return student;
  }

  async updateMe(userId: string, data: Partial<CreateStudentDto>) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Perfil de estudante não encontrado');

    return this.prisma.student.update({
      where: { userId },
      data: {
        phone: data.phone,
        address: data.address,
        bairro: data.bairro,
        course: data.course,
        period: data.period,
      },
      include: { user: true, school: true, plan: true },
    });
  }

  async getWeeklyUsage(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: { plan: true },
    });
    if (!student) throw new NotFoundException('Perfil de estudante não encontrado');

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const used = await this.prisma.studentUsage.count({
      where: { studentId: student.id, date: { gte: weekStart, lte: weekEnd } },
    });

    return {
      used,
      limit: student.plan?.usesPerWeek ?? 0,
      planName: student.plan?.name,
    };
  }

  async uploadDocument(userId: string, type: string, file: Express.Multer.File) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Estudante não encontrado');

    const relativePath = await this.uploads.saveFile(file, `documents/${student.id}`);

    // Upsert: replace if same type already exists
    const existing = await this.prisma.document.findFirst({
      where: { studentId: student.id, type },
    });

    if (existing) {
      return this.prisma.document.update({
        where: { id: existing.id },
        data: { url: relativePath },
      });
    }

    return this.prisma.document.create({
      data: { studentId: student.id, type, url: relativePath },
    });
  }

  getSchools() {
    return this.prisma.school.findMany({ orderBy: { name: 'asc' } });
  }

  getPlans() {
    return this.prisma.plan.findMany({ orderBy: { price: 'asc' } });
  }

  // ── Admin ──────────────────────────────────────────────

  async findAll(status?: string, search?: string) {
    const where: Record<string, unknown> = {};

    if (status && status !== 'all') {
      const map: Record<string, StudentStatus> = {
        pending: 'PENDENTE',
        approved: 'APROVADO',
        rejected: 'REPROVADO',
        correction: 'EM_CORRECAO',
        analysis: 'EM_ANALISE',
      };
      if (map[status]) where.status = map[status];
    }

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

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        school: true,
        plan: true,
        documents: true,
        payments: { orderBy: { createdAt: 'desc' } },
        usages: { orderBy: { date: 'desc' }, take: 20 },
      },
    });
    if (!student) throw new NotFoundException('Estudante não encontrado');
    return student;
  }
}

