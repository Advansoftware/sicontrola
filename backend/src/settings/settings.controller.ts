import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/settings')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  // ── Schools ──────────────────────────────────────────────
  @Get('schools')
  getSchools() {
    return this.settingsService.getSchools();
  }

  @Post('schools')
  createSchool(@Body() body: { name: string; address: string }) {
    return this.settingsService.createSchool(body.name, body.address);
  }

  @Delete('schools/:id')
  deleteSchool(@Param('id') id: string) {
    return this.settingsService.deleteSchool(id);
  }

  // ── Routes ───────────────────────────────────────────────
  @Get('routes')
  getRoutes() {
    return this.settingsService.getRoutes();
  }

  @Post('routes')
  createRoute(@Body() body: { name: string; origin: string; destination: string; description?: string }) {
    return this.settingsService.createRoute(body);
  }

  @Delete('routes/:id')
  deleteRoute(@Param('id') id: string) {
    return this.settingsService.deleteRoute(id);
  }

  // ── Plans ────────────────────────────────────────────────
  @Get('plans')
  getPlans() {
    return this.settingsService.getPlans();
  }

  @Patch('plans/:id')
  updatePlan(
    @Param('id') id: string,
    @Body() body: { price?: number; usesPerWeek?: number; description?: string },
  ) {
    return this.settingsService.updatePlan(id, body);
  }

  // ── System Settings ──────────────────────────────────────
  @Get('system')
  getSystem() {
    return this.settingsService.getSystemSettings();
  }

  @Patch('system')
  updateSystem(@Body() body: Record<string, unknown>) {
    return this.settingsService.updateSystemSettings(body);
  }
}
