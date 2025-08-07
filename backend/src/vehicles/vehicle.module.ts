/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from '../entity/vehicle.entity';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { Keyv, createKeyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

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
            createKeyv('redis://localhost:6379'),
          ],
        };
      },
    }),
],
  providers: [VehicleService],
  controllers: [VehicleController],
})
export class VehicleModule {}