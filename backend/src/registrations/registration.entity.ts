import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Class } from '../classes/class.entity';
import { Student } from '../students/student.entity';

@Entity()
export class Registration {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() class_id: string;
  @Column() student_id: string;
  @CreateDateColumn() created_at: Date;

  @ManyToOne(() => Class, (cls) => cls.registrations)
  @JoinColumn({ name: 'class_id' }) class: Class;

  @ManyToOne(() => Student, (student) => student.registrations)
  @JoinColumn({ name: 'student_id' }) student: Student;
}
