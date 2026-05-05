import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { UsageService } from './usage.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User } from '../auth/user.decorator';

@Controller('api/usage')
@UseGuards(AuthGuard)
export class UsageController {
  constructor(private readonly usageService: UsageService) { }

  /** Motorista valida QR Code e registra embarque */
  @Post('validate')
  @UseGuards(RolesGuard)
  @Roles('MOTORISTA', 'ADMIN')
  validate(@Body('qrCode') qrCode: string, @User('id') userId: string) {
    return this.usageService.validateAndRegister(qrCode, userId);
  }

  /** Motorista: registros do dia atual */
  @Get('driver/today')
  @UseGuards(RolesGuard)
  @Roles('MOTORISTA', 'ADMIN')
  driverToday(@User('id') userId: string) {
    return this.usageService.getDriverTodayRecords(userId);
  }

  /** Aluno: uso da semana atual */
  @Get('student/week')
  @UseGuards(RolesGuard)
  @Roles('ALUNO', 'ADMIN')
  studentWeek(@User('id') userId: string) {
    return this.usageService.getStudentWeekUsage(userId);
  }
}

