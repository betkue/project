/* eslint-disable prettier/prettier */

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { VehicleEntity } from './entity/vehicle.entity';

export const dataSource = new DataSource({
    type: 'postgres',
     host: 'database',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'beev',
    synchronize: true,
    logging: false,
    entities: [VehicleEntity],
    migrations: [],
    subscribers: [],
});

