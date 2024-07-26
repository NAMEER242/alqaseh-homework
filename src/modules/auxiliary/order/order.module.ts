import { Module } from '@nestjs/common';
import { AdminModule } from '../admin';
import { CustomerModule } from '../customer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@qaseh/entities';
import { OrderService } from './providers/services/order.service';
import { OrderFormatter } from './providers/formatters/order.formatter';
import { OrderController } from './controllers/order.controller';
import { AuthModule } from '../auth';
import { ProductModule } from '../product';
import { DiscountModule } from '../discount';
import { CustomerOrdersController } from './controllers/customer-orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    AuthModule,
    AdminModule,
    CustomerModule,
    ProductModule,
    DiscountModule,
  ],
  controllers: [OrderController, CustomerOrdersController],
  providers: [OrderService, OrderFormatter],
  exports: [OrderService, OrderFormatter],
})
export class OrderModule {}
