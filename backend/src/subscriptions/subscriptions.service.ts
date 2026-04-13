import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(@InjectRepository(Subscription) private repo: Repository<Subscription>) {}
  create(data: any) { return this.repo.save(data); }
  async useSession(id: string) {
    const sub = await this.repo.findOne({ where: { id } });
    if (!sub) throw new NotFoundException('Không tìm thấy gói học.');
    sub.used_sessions += 1;
    return this.repo.save(sub);
  }
  findOne(id: string) { return this.repo.findOne({ where: { id } }); }
}
