import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { AppConfigService } from './providers/services/app-config.service';
import { DBConfigService } from './providers/services/db-config.service';
import { JwtConfigService } from './providers/services/jwt-config.service';

/**
 * @class ConfigModule
 *
 * @description
 * A NestJS module that handles application configuration. It uses the '@nestjs/config' module to load environment variables
 * from '.env' and '.env.{APP_ENV_PATH}' files, validates them using a custom function, and provides them as services that
 * can be accessed throughout the application. This module sets up the configuration system for the application, allowing
 * easy access to environment variables. It also enables caching to improve performance when accessing configuration values.
 *
 * @public
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      load: [
        () =>
          dotenv.parse(
            process.env.APP_ENV_PATH
              ? fs.readFileSync(process.env.APP_ENV_PATH)
              : '',
          ),
      ],
    }),
  ],
  providers: [AppConfigService, DBConfigService, JwtConfigService],
  exports: [AppConfigService, DBConfigService, JwtConfigService],
})
export class ConfigModule {}
