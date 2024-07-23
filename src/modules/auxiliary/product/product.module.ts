import { Module } from '@nestjs/common';
import { AdminModule } from '../admin';
import { CustomerModule } from '../customer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@qaseh/entities';
import { ProductService } from './providers/services/product.service';
import { ProductFormatter } from './providers/formatters/product.formatter';
import { ProductController } from './controllers/product.controller';
import { CustomerProductsController } from './controllers/customer-products.controller';
import { CustomerProductsFormatter } from './providers/formatters/customer-products.formatter';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    AdminModule,
    CustomerModule,
  ],
  controllers: [ProductController, CustomerProductsController],
  providers: [ProductService, ProductFormatter, CustomerProductsFormatter],
  exports: [ProductService, ProductFormatter, CustomerProductsFormatter],
})
export class ProductModule {}
