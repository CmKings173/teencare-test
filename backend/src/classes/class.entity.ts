import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Registration } from '../registrations/registration.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column() subject: string;
  @Column() day_of_week: string;
  @Column() time_slot: string;
  @Column() teacher_name: string;
  @Column() max_students: number;
  
  @OneToMany(() => Registration, (reg) => reg.class) registrations: Registration[];
}
