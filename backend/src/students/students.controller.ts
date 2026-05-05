import {
  Controller, Get, Post, Patch, Body, Param,
  UseGuards, UseInterceptors, UploadedFile, BadRequestException, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User } from '../auth/user.decorator';

@Controller('api/students')
@UseGuards(AuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  // ── Student-facing ───────────────────────────────────────

  @Post()
  create(@User('id') userId: string, @Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(userId, createStudentDto);
  }

  @Get('me')
  findMe(@User('id') userId: string) {
    return this.studentsService.findMe(userId);
  }

  @Patch('me')
  updateMe(@User('id') userId: string, @Body() body: Partial<CreateStudentDto>) {
    return this.studentsService.updateMe(userId, body);
  }

  @Get('me/weekly-usage')
  getWeeklyUsage(@User('id') userId: string) {
    return this.studentsService.getWeeklyUsage(userId);
  }

  @Post('documents')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @User('id') userId: string,
    @Body('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo não enviado');
    if (!type) throw new BadRequestException('Tipo do documento não informado');
    return this.studentsService.uploadDocument(userId, type, file);
  }

  // ── Shared lookups ───────────────────────────────────────

  @Get('schools')
  getSchools() {
    return this.studentsService.getSchools();
  }

  @Get('plans')
  getPlans() {
    return this.studentsService.getPlans();
  }

  // ── Admin-facing ─────────────────────────────────────────

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SECRETARIA')
  findAll(@Query('status') status?: string, @Query('search') search?: string) {
    return this.studentsService.findAll(status, search);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SECRETARIA')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }
}

