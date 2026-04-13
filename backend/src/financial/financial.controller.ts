import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User } from '../auth/user.decorator';

@Controller('api/financial')
@UseGuards(AuthGuard, RolesGuard)
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post('payments')
  @Roles('ALUNO', 'ADMIN')
  create(@User('id') userId: string, @Body('amount') amount: number, @Body('method') method: string) {
    return this.financialService.createPayment(userId, amount, method);
  }

  @Get('payments/me')
  @Roles('ALUNO', 'ADMIN')
  findMe(@User('id') userId: string) {
    return this.financialService.getMyPayments(userId);
  }

  @Get('dashboard')
  @Roles('SECRETARIA', 'ADMIN')
  getDashboard() {
    return this.financialService.getGlobalStats();
  }
}
