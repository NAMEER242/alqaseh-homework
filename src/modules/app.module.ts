import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config';
import { DatabaseModule } from './core/database';
import { FormatterModule } from '@qaseh/modules/formatter';
import { AuthModule } from './auxiliary/auth';
import { AdminModule } from './auxiliary/admin';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity, OrderEntity, ProductEntity } from '@qaseh/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, ProductEntity, OrderEntity]),
    ConfigModule,
    DatabaseModule,
    FormatterModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
