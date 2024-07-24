import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from '@qaseh/entities';
import { DiscountService } from './providers/services/discount.service';
import { DiscountFormatter } from './providers/formatters/discount.formatter';
import { DiscountController } from './controllers/discount.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity])],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountFormatter],
  exports: [DiscountService, DiscountFormatter],
})
export class DiscountModule {}
