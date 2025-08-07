export enum VehicleStatus {
  AVAILABLE = 'available',
  CHARGING = 'charging',
  IN_USE = 'in_use',
}

export enum VehicleType {
  BEV = 'BEV',
  ICE = 'ICE',
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  batteryCapacity: number;
  currentChargeLevel: number;
  status: VehicleStatus;
  lastUpdated: Date;
  averageEnergyConsumption: number;
  type: VehicleType;
  emissionGco2Km: number;
  createdAt: Date;
}
