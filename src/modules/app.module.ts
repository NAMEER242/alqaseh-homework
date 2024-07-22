import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config';
import { DatabaseModule } from './core/database';
import { FormatterModule } from '@qaseh/modules/formatter';
import { AuthModule } from './auxiliary/auth';
import { AdminModule } from './auxiliary/admin';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity, OrderEntity } from '@qaseh/entities';
import { CustomerModule } from './auxiliary/customer';
import { ProductModule } from './auxiliary/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, OrderEntity]),
    ConfigModule,
    DatabaseModule,
    FormatterModule,
    AuthModule,
    AdminModule,
    CustomerModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
