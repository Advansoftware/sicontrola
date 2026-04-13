import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import 'multer';
import { PrismaService } from '../prisma/prisma.service';

import { CreateStudentDto } from './dto/create-student.dto';
import { UploadsService } from '../uploads/uploads.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploads: UploadsService,
    private readonly mail: MailService,
  ) {}

  async create(userId: string, createStudentDto: CreateStudentDto) {
    const existing = await this.prisma.student.findUnique({
      where: { userId },
    });

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
      include: {
        user: true,
      }
    });

    // Enviar e-mail de confirmação assincronamente
    this.mail.sendConfirmationEmail(student.user.email, student.user.name ?? student.user.email).catch(console.error);

    return student;
  }

  async findMe(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        school: true,
        plan: true,
        documents: true,
        payments: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Perfil de estudante não encontrado');
    }

    return student;
  }

  async uploadDocument(userId: string, type: string, file: Express.Multer.File) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Estudante não encontrado');
    }

    const relativePath = await this.uploads.saveFile(file, `documents/${student.id}`);

    return this.prisma.document.create({
      data: {
        studentId: student.id,
        type,
        url: relativePath,
      },
    });
  }

  async getSchools() {
    return this.prisma.school.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getPlans() {
    return this.prisma.plan.findMany({
      orderBy: { price: 'asc' },
    });
  }
}
