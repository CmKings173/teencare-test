import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';

@Controller('api')
export class RegistrationsController {
  constructor(private readonly regsService: RegistrationsService) {}

  @Post('classes/:class_id/register')
  register(@Param('class_id') class_id: string, @Body('student_id') student_id: string) {
    return this.regsService.register(class_id, student_id);
  }

  @Delete('registrations/:id')
  cancel(@Param('id') id: string) {
    return this.regsService.cancel(id);
  }
}
