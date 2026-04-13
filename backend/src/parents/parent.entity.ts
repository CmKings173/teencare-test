import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from '../students/student.entity';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column() phone: string;
  @Column() email: string;
  @OneToMany(() => Student, (student) => student.parent) students: Student[];
}
