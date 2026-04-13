import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParentsModule } from './parents/parents.module';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { Parent } from './parents/parent.entity';
import { Student } from './students/student.entity';
import { Class } from './classes/class.entity';
import { Subscription } from './subscriptions/subscription.entity';
import { Registration } from './registrations/registration.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'postgres', // Đổi về postgres mặc định để dễ chạy local
      entities: [Parent, Student, Class, Subscription, Registration],
      synchronize: true, // Auto sync schema for test project
    }),
    ParentsModule,
    StudentsModule,
    ClassesModule,
    SubscriptionsModule,
    RegistrationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
