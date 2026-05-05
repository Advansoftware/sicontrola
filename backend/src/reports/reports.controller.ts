import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/reports')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN', 'SECRETARIA')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('students')
  getStudents() {
    return this.reportsService.getStudentsReport();
  }

  @Get('financial')
  getFinancial() {
    return this.reportsService.getFinancialReport();
  }

  @Get('usage')
  getUsage() {
    return this.reportsService.getUsageReport();
  }
}
