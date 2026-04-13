import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() student_id: string;
  @Column() package_name: string;
  @Column({ type: 'date' }) start_date: Date;
  @Column({ type: 'date' }) end_date: Date;
  @Column() total_sessions: number;
  @Column({ default: 0 }) used_sessions: number;

  @ManyToOne(() => Student, (student) => student.subscriptions)
  @JoinColumn({ name: 'student_id' }) student: Student;
}
