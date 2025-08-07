/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../entity/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async findAll() {
    const cacheKey = `all-V`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const qb = this.vehicleRepository.createQueryBuilder('v');
    const vehicles = await qb
      .orderBy('v.createdAt', 'DESC')
      .getMany();

    await this.cacheManager.set(cacheKey, vehicles, 60);
    return vehicles;
  }


  async findOne(id: string): Promise<VehicleEntity | null> {
    const cacheKey = `V-${id}`;
    const cached = await this.cacheManager.get<VehicleEntity>(cacheKey);
    if (cached) return cached;

    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (vehicle) await this.cacheManager.set(cacheKey, vehicle, 60);
    return vehicle;
  }


  async create(dto: CreateVehicleDto) {
    try {
      const v = this.vehicleRepository.create(dto);
      const saved = await this.vehicleRepository.save(v);
      await this.cacheManager.del('all-V');
      await this.cacheManager.del('analytics-FE');
      await this.cacheManager.del('analytics-FC');
      await this.cacheManager.del('analytics-FO');
      return saved;
    } catch (error) {
      return error;
    }
  }

  async update(id: string, dto: UpdateVehicleDto) {
    const v = await this.vehicleRepository.preload({ id, ...dto });
    if (!v) throw new NotFoundException(`Vehicle ${id} not found`);
    const updated = await this.vehicleRepository.save(v);
    await this.cacheManager.del(`V-${id}`);
    await this.cacheManager.del('all-V');
    await this.cacheManager.del('analytics-FE');
    await this.cacheManager.del('analytics-FC');
    await this.cacheManager.del('analytics-FO');
    return updated;
  }

  async remove(id: string) {
    const vehicle = await this.findOne(id);
    if (!vehicle) throw new NotFoundException(`Vehicle ${id} not found`);
    const removed = await this.vehicleRepository.remove(vehicle);
    await this.cacheManager.del(`V-${id}`);
    await this.cacheManager.del('all-V');
    await this.cacheManager.del('analytics-FE');
    await this.cacheManager.del('analytics-FC');
    await this.cacheManager.del('analytics-FO');
    return removed;
  }
}
