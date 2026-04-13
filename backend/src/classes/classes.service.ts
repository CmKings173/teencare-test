import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';

@Injectable()
export class ClassesService {
  constructor(@InjectRepository(Class) private repo: Repository<Class>) {}
  create(data: any) { return this.repo.save(data); }
  findByDay(day: string) { return this.repo.find({ where: { day_of_week: day }, relations: ['registrations', 'registrations.student'] }); }
  findAll() { return this.repo.find({ relations: ['registrations', 'registrations.student'] }); }
}
