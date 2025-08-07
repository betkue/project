/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum VehicleStatus {
  AVAILABLE = 'available',
  CHARGING = 'charging',
  IN_USE = 'in_use',
}

export enum VehicleType {
  BEV = 'BEV',
  ICE = 'ICE',
}

@Entity('vehicles') 
export class VehicleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({ type: 'float', name: 'battery_capacity_kwh' })
  batteryCapacity: number;

  @Column({ type: 'float', name: 'current_charge_level_percent' })
  currentChargeLevel: number;

  @Column({ type: 'enum', enum: VehicleStatus })
  status: VehicleStatus;

  @Column({ type: 'timestamp', name: 'last_updated' })
  lastUpdated: Date;

  @Column({ type: 'float', name: 'average_energy_consumption_kwh_per_100km' })
  averageEnergyConsumption: number;

  @Column({ type: 'enum', enum: VehicleType })
  type: VehicleType;

  @Column({ type: 'float', name: 'emission_gco2_per_km' })
  emissionGco2Km: number;

  @CreateDateColumn()
  createdAt: Date;
}
