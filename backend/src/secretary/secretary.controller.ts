import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { SecretaryService } from './secretary.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { StudentStatus } from '@prisma/client';

@Controller('api/secretary')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN', 'SECRETARIA')
export class SecretaryController {
  constructor(private readonly secretaryService: SecretaryService) { }

  /** Listar alunos com filtro opcional por status e busca */
  @Get('students')
  findStudents(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.secretaryService.findStudents(status, search);
  }

  /** Mantido por compatibilidade — retorna pendentes/análise/correção */
  @Get('students/pending')
  findPending() {
    return this.secretaryService.findStudents('pending');
  }

  @Patch('students/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: StudentStatus,
    @Body('reason') reason?: string,
  ) {
    return this.secretaryService.updateStatus(id, status, reason);
  }

  @Get('dashboard/stats')
  getStats() {
    return this.secretaryService.getDashboardStats();
  }
}

