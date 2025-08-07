/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { VehicleStatus, VehicleType } from '../../entity/vehicle.entity';

export class CreateVehicleDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  batteryCapacity: number;

  @IsNumber()
  currentChargeLevel: number;

  @IsEnum(VehicleStatus)
  status: VehicleStatus;

  @IsDateString()
  lastUpdated: string;

  @IsNumber()
  averageEnergyConsumption: number;

  @IsEnum(VehicleType)
  type: VehicleType;

  @IsNumber()
  emissionGco2Km: number;
}
