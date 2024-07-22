import { Module } from '@nestjs/common';
import { AdminModule } from '../admin';
import { CustomerModule } from '../customer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@qaseh/entities';
import { ProductService } from './providers/services/product.service';
import { ProductFormatter } from './providers/formatters/product.formatter';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    AdminModule,
    CustomerModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductFormatter],
  exports: [ProductService, ProductFormatter],
})
export class ProductModule {}
