import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsageService } from './usage.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User } from '../auth/user.decorator';

@Controller('api/usage')
@UseGuards(AuthGuard, RolesGuard)
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Post('validate')
  @Roles('MOTORISTA', 'ADMIN')
  validate(@Body('qrCode') qrCode: string, @User('id') userId: string) {
    return this.usageService.validateAndRegister(qrCode, userId);
  }
}
