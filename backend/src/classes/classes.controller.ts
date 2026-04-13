import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';

@Controller('api/classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}
  @Post() create(@Body() body: any) { return this.classesService.create(body); }
  @Get() find(@Query('day') day: string) {
    if (day) return this.classesService.findByDay(day);
    return this.classesService.findAll();
  }
}
