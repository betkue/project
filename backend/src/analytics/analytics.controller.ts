/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
// @UseInterceptors(CacheInterceptor)
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('fleet-efficiency')
  fleetEfficiency() {
    return this.service.fleetEfficiency();
  }

  @Get('fleet-composition')
  fleetComposition() {
    return this.service.fleetComposition();
  }

  @Get('fleet-operational')
  fleetOperational() {
    return this.service.fleetOperational();
  }
}
