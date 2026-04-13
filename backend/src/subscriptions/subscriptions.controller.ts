import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('api/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}
  @Post() create(@Body() body: any) { return this.subscriptionsService.create(body); }
  @Get(':id') findOne(@Param('id') id: string) { return this.subscriptionsService.findOne(id); }
  @Patch(':id/use') useSession(@Param('id') id: string) { return this.subscriptionsService.useSession(id); }
}
