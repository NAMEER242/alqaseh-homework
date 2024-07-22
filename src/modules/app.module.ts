import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config';
import { DatabaseModule } from './core/database';
import { FormatterModule } from '@qaseh/modules/formatter';
import { AuthModule } from './auxiliary/auth';
import { AdminModule } from './auxiliary/admin';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity, OrderEntity, ProductEntity } from '@qaseh/entities';
import { CustomerModule } from './auxiliary/customer';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, ProductEntity, OrderEntity]),
    ConfigModule,
    DatabaseModule,
    FormatterModule,
    AuthModule,
    AdminModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
