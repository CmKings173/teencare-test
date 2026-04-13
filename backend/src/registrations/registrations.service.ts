import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Registration } from './registration.entity';
import { Class } from '../classes/class.entity';
import { Subscription } from '../subscriptions/subscription.entity';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration) private regRepo: Repository<Registration>,
    @InjectRepository(Class) private classRepo: Repository<Class>,
    @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
    private dataSource: DataSource
  ) {}

  private parseSlot(slot: string) {
    const [start, end] = slot.split('-');
    const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    return { startMin: toMin(start), endMin: toMin(end) };
  }

  private slotsOverlap(a: string, b: string) {
    const { startMin: s1, endMin: e1 } = this.parseSlot(a);
    const { startMin: s2, endMin: e2 } = this.parseSlot(b);
    return e1 > s2 && e2 > s1;
  }

  private nextClassTimestamp(dayOfWeek: string, timeSlot: string): number {
    const DAY_MAP: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const targetDay = DAY_MAP[dayOfWeek] || 1;
    const { startMin } = this.parseSlot(timeSlot);
    const now = new Date();
    const result = new Date(now);
    let diff = (targetDay - now.getDay() + 7) % 7;
    result.setDate(now.getDate() + diff);
    result.setHours(Math.floor(startMin / 60), startMin % 60, 0, 0);
    if (result.getTime() <= now.getTime()) result.setDate(result.getDate() + 7);
    return Math.floor(result.getTime() / 1000);
  }

  async register(classId: string, studentId: string) {
    return this.dataSource.transaction(async (manager) => {
      const cls = await manager.createQueryBuilder(Class, 'class')
                               .setLock('pessimistic_write')
                               .where('class.id = :id', { id: classId })
                               .getOne();
      if (!cls) throw new NotFoundException('Class not found');

      const count = await manager.count(Registration, { where: { class_id: classId } });
      if (count >= cls.max_students) throw new BadRequestException('Class is full');

      const activeSub = await manager.createQueryBuilder(Subscription, 'sub')
                                     .where('sub.student_id = :sid', { sid: studentId })
                                     .andWhere('sub.end_date >= :now', { now: new Date() })
                                     .andWhere('sub.used_sessions < sub.total_sessions')
                                     .getOne();
      if (!activeSub) throw new BadRequestException('No active subscription');

      const existingRegs = await manager.find(Registration, { where: { student_id: studentId }, relations: ['class'] });
      for (const reg of existingRegs) {
        if (reg.class.day_of_week === cls.day_of_week && this.slotsOverlap(reg.class.time_slot, cls.time_slot)) {
          throw new BadRequestException('Time conflict');
        }
      }

      const newReg = manager.create(Registration, { class_id: classId, student_id: studentId });
      await manager.save(newReg);

      activeSub.used_sessions += 1;
      await manager.save(activeSub);

      return newReg;
    });
  }

  async cancel(id: string) {
    return this.dataSource.transaction(async (manager) => {
      const reg = await manager.findOne(Registration, { where: { id }, relations: ['class'] });
      if (!reg) throw new NotFoundException('Registration not found');

      const nextClassSec = this.nextClassTimestamp(reg.class.day_of_week, reg.class.time_slot);
      const nowSec = Math.floor(Date.now() / 1000);
      const hoursUntilClass = (nextClassSec - nowSec) / 3600;
      const shouldRefund = hoursUntilClass > 24;

      await manager.delete(Registration, { id });

      if (shouldRefund) {
        const sub = await manager.createQueryBuilder(Subscription, 'sub')
                                 .where('sub.student_id = :sid', { sid: reg.student_id })
                                 .andWhere('sub.used_sessions > 0')
                                 .orderBy('sub.start_date', 'DESC')
                                 .getOne();
        if (sub) {
          sub.used_sessions -= 1;
          await manager.save(sub);
        }
      }
      return { refunded: shouldRefund };
    });
  }
}
