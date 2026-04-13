import { Controller, Get, Post, Body, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@Controller('api/students')
@UseGuards(AuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@User('id') userId: string, @Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(userId, createStudentDto);
  }

  @Get('me')
  findMe(@User('id') userId: string) {
    return this.studentsService.findMe(userId);
  }

  @Post('documents')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @User('id') userId: string,
    @Body('type') type: string,
    @UploadedFile() file: Express.Multer.File,

  ) {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }
    if (!type) {
      throw new BadRequestException('Tipo do documento não informado');
    }
    return this.studentsService.uploadDocument(userId, type, file);
  }

  @Get('schools')
  getSchools() {
    return this.studentsService.getSchools();
  }

  @Get('plans')
  getPlans() {
    return this.studentsService.getPlans();
  }
}
