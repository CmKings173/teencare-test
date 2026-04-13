import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './parent.entity';

@Injectable()
export class ParentsService {
  constructor(@InjectRepository(Parent) private repo: Repository<Parent>) {}
  create(data: any) { return this.repo.save(data); }
  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOne({ where: { id }, relations: ['students'] }); }
}
