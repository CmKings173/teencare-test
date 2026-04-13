import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Parent } from '../parents/parent.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { Registration } from '../registrations/registration.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ type: 'date' }) dob: Date;
  @Column() gender: string;
  @Column() current_grade: string;
  @Column() parent_id: string;

  @ManyToOne(() => Parent, (parent) => parent.students)
  @JoinColumn({ name: 'parent_id' }) parent: Parent;

  @OneToMany(() => Subscription, (sub) => sub.student) subscriptions: Subscription[];
  @OneToMany(() => Registration, (reg) => reg.student) registrations: Registration[];
}
