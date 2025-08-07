/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity, VehicleStatus } from '../entity/vehicle.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }


  async fleetEfficiency() {
    try {
      const cacheKey = 'analytics-FE';
      const cached = await this.cacheManager.get(cacheKey);

      if (cached) return cached;

      const avgConsumption = await this.vehicleRepository
        .createQueryBuilder('vehicle')
        .select('AVG(vehicle.averageEnergyConsumption)', 'avgEnergy')
        .getRawOne();

      const emissionsComparison = await this.vehicleRepository
        .createQueryBuilder('vehicle')
        .select('vehicle.type', 'type')
        .addSelect('AVG(vehicle.emissionGco2Km)', 'avgEmissions')
        .groupBy('vehicle.type')
        .getRawMany();

      const result = { avgConsumption, emissionsComparison };

      await this.cacheManager.set(cacheKey, result, 60);


      return result;
    } catch (error) {
      return error;
    }
  }

  async fleetComposition() {
    const cacheKey = 'analytics-FC';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const distribution = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('vehicle.type')
      .getRawMany();

    await this.cacheManager.set(cacheKey, distribution, 60);


    return distribution;
  }

  async fleetOperational() {
    const cacheKey = 'analytics-FO';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const total = await this.vehicleRepository.count();
    const available = await this.vehicleRepository.count({
      where: { status: VehicleStatus.AVAILABLE },
    });
    const charging = await this.vehicleRepository.count({
      where: { status: VehicleStatus.CHARGING },
    });
    const inUse = await this.vehicleRepository.count({
      where: { status: VehicleStatus.IN_USE },
    });

    const result = {
      availabilityRate: total ? (available / total) * 100 : 0,
      charging,
      inUse,
    };

    await this.cacheManager.set(cacheKey, result, 60);


    return result;
  }
}
