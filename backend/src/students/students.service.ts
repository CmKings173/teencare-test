import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(@InjectRepository(Student) private repo: Repository<Student>) {}
  create(data: any) { return this.repo.save(data); }
  findOne(id: string) { return this.repo.findOne({ where: { id }, relations: ['parent', 'subscriptions', 'registrations', 'registrations.class'] }); }
  findAll() { return this.repo.find({ relations: ['parent', 'subscriptions', 'registrations', 'registrations.class'] }); }
}
