import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User } from '../auth/user.decorator';

@Controller('api/financial')
@UseGuards(AuthGuard, RolesGuard)
export class FinancialController {
  constructor(private readonly financialService: FinancialService) { }

  // ── Student ───────────────────────────────────────────────

  @Post('payments')
  @Roles('ALUNO', 'ADMIN')
  create(
    @User('id') userId: string,
    @Body('amount') amount: number,
    @Body('method') method: string,
    @Body('transactionId') transactionId?: string,
  ) {
    return this.financialService.createPayment(userId, amount, method, transactionId);
  }

  @Get('payments/me')
  @Roles('ALUNO', 'ADMIN')
  findMe(@User('id') userId: string) {
    return this.financialService.getMyPayments(userId);
  }

  // ── Admin ─────────────────────────────────────────────────

  @Get('students')
  @Roles('SECRETARIA', 'ADMIN')
  getStudents(@Query('filter') filter?: string, @Query('search') search?: string) {
    return this.financialService.getStudentsWithPayments(filter, search);
  }

  @Post('payments/admin/:studentId')
  @Roles('ADMIN', 'SECRETARIA')
  adminPay(
    @Param('studentId') studentId: string,
    @Body('amount') amount: number,
    @Body('method') method: string,
  ) {
    return this.financialService.adminCreatePayment(studentId, amount, method);
  }

  @Get('dashboard')
  @Roles('SECRETARIA', 'ADMIN')
  getDashboard() {
    return this.financialService.getGlobalStats();
  }
}

