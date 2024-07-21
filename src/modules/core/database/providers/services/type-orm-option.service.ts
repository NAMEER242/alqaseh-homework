import { Injectable } from '@nestjs/common';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { DBConfigService } from '@qaseh/modules/config';

@Injectable()
export class TypeOrmOptionService implements TypeOrmOptionsFactory {
  constructor(private readonly dbConfigService: DBConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleAsyncOptions {
    this.dbConfigService.prefix = '';

    return {
      type: this.dbConfigService.type,
      host: this.dbConfigService.host,
      port: this.dbConfigService.port,
      database: this.dbConfigService.name,
      username: this.dbConfigService.username,
      password: this.dbConfigService.password,
      logging: this.dbConfigService.isLogging,
      synchronize: this.dbConfigService.isSynchronize,
      autoLoadEntities: this.dbConfigService.isAutoLoadEntities,
    } as TypeOrmModuleAsyncOptions;
  }
}
