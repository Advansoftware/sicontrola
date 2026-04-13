import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfWeek, endOfWeek } from 'date-fns';

@Injectable()
export class UsageService {
  constructor(private readonly prisma: PrismaService) {}

  async validateAndRegister(qrCode: string, userId: string) {
    // 1. Get driver profile
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
    });

    if (!driver) {
      throw new ForbiddenException('Apenas motoristas podem validar embarques');
    }

    // 2. Find student by QR Code
    const student = await this.prisma.student.findUnique({
      where: { qrCode },
      include: {
        plan: true,
        user: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Estudante não encontrado ou QR Code inválido');
    }

    // 3. Check status
    if (student.status !== 'APROVADO') {
      throw new BadRequestException(`Estudante com status ${student.status}. Embarque negado.`);
    }

    // 4. Check weekly use limit
    if (student.plan) {
      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

      const weeklyUsageCount = await this.prisma.studentUsage.count({
        where: {
          studentId: student.id,
          date: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      });

      if (weeklyUsageCount >= student.plan.usesPerWeek) {
        throw new BadRequestException(`Limite semanal de ${student.plan.usesPerWeek} usos atingido.`);
      }
    }

    // 5. Register usage (simplified route for now)
    // For now we'll find a default route or just use a placeholder ID if it doesn't exist
    let routeId = 'default_route';
    const existingRoute = await this.prisma.route.findFirst();
    if (existingRoute) {
       routeId = existingRoute.id;
    } else {
       const newRoute = await this.prisma.route.create({
         data: { id: 'default_route', name: 'Rota Padrão', origin: 'Centro', destination: 'Escola' }
       });
       routeId = newRoute.id;
    }

    const usage = await this.prisma.studentUsage.create({
      data: {
        studentId: student.id,
        driverId: driver.id,
        routeId: routeId,
        date: new Date(),
      },
    });

    return {
      success: true,
      message: 'Embarque autorizado!',
      student: {
        name: student.user.name,
        school: student.schoolId,
      },
      usage,
    };
  }
}
