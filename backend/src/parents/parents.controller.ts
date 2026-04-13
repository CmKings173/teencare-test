import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ParentsService } from './parents.service';

@Controller('api/parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}
  @Post() create(@Body() body: any) { return this.parentsService.create(body); }
  @Get() findAll() { return this.parentsService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.parentsService.findOne(id); }
}
