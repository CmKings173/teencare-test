import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('api/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
  @Post() create(@Body() body: any) { return this.studentsService.create(body); }
  @Get() findAll() { return this.studentsService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.studentsService.findOne(id); }
}
