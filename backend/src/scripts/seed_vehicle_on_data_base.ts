/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { dataSource } from '../data-source';
import { VehicleEntity, VehicleStatus, VehicleType } from '../entity/vehicle.entity';

async function seedVehicleOnDataBase() {
  await dataSource.initialize();

  const vehicleRepo = dataSource.getRepository(VehicleEntity);

  await vehicleRepo.clear();

  const vehicles: VehicleEntity[] = [];

  const csvFilePath = path.resolve(__dirname, '../../../data/cars.csv');

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        const vehicle = new VehicleEntity();

        vehicle.id = row.ID;
        vehicle.brand = row.Brand;
        vehicle.model = row.Model;
        vehicle.batteryCapacity = parseFloat(row['Battery capacity (kWh)']);
        vehicle.currentChargeLevel = parseFloat(row['Current charge level (%)']);

        if (row.Status === 'available') vehicle.status = VehicleStatus.AVAILABLE;
        else if (row.Status === 'charging') vehicle.status = VehicleStatus.CHARGING;
        else if (row.Status === 'in_use') vehicle.status = VehicleStatus.IN_USE;
        else vehicle.status = VehicleStatus.AVAILABLE; 

        vehicle.lastUpdated = new Date(row['Last updated']);
        vehicle.averageEnergyConsumption = parseFloat(row['Average energy consumption (kWh/100km or L/100km)']);

        if (row.Type === 'BEV') vehicle.type = VehicleType.BEV;
        else if (row.Type === 'ICE') vehicle.type = VehicleType.ICE;
        else vehicle.type = VehicleType.BEV;

        vehicle.emissionGco2Km = parseFloat(row['Emission_gco2_km']);

        vehicles.push(vehicle);
      })
      .on('end', () => {
        console.log(`✅ Parsed ${vehicles.length} vehicles from CSV`);
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  await vehicleRepo.save(vehicles);

  console.log('✅ Vehicles seeded successfully!');

  await dataSource.destroy();
}

seedVehicleOnDataBase().catch((err) => {
  console.error('❌ Error during Vehicles seeding:', err);
});
