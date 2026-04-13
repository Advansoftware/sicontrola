import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { SecretaryService } from './secretary.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { StudentStatus } from '@prisma/client';

@Controller('api/secretary')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN', 'SECRETARIA')
export class SecretaryController {
  constructor(private readonly secretaryService: SecretaryService) {}

  @Get('students/pending')
  findPending() {
    return this.secretaryService.findPendingStudents();
  }

  @Patch('students/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: StudentStatus,
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    return this.secretaryService.updateStatus(id, status, rejectionReason);
  }

  @Get('dashboard/stats')
  getStats() {
    return this.secretaryService.getDashboardStats();
  }
}
