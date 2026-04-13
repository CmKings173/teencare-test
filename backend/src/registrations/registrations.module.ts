import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { Registration } from './registration.entity';
import { Class } from '../classes/class.entity';
import { Subscription } from '../subscriptions/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registration, Class, Subscription])],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}
