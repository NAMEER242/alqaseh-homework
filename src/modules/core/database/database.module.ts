import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@qaseh/modules/config';
import { TypeOrmOptionService } from './providers/services/type-orm-option.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmOptionService,
    }),
  ],
})
export class DatabaseModule {}
