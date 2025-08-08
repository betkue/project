/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from '../entity/vehicle.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheableMemory, Keyv } from 'cacheable';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity]),
  CacheModule.registerAsync({
    useFactory: async () => {
      return {
        stores: [
          new Keyv({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            store: new CacheableMemory({ lruSize: 5000 }),
          }),
          createKeyv('redis://default@redis:6379'),
        ],
      };
    },
  }),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule { }