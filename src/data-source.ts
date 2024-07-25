import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: process.env.DB_SYNCHRONIZE.toString().toLowerCase() === 'true',
  entities: [__dirname + '/entities/*.js'],
  migrations: [__dirname + '/migration/*.js'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
