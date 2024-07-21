import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { PaymentMethod } from '../enums/order.enum';
import { ProductResponseDto } from './product.dto';
import { ResponseCustomerDto } from './cusotmer.dto';

export class OrderDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderPrice: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  paymentMethod: PaymentMethod;

  @ApiProperty()
  purchasedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateOrderDto extends PickType(OrderDto, [
  'orderPrice',
  'discount',
  'paymentMethod',
]) {}

export class UpdateOrderDto extends PartialType(
  PickType(OrderDto, ['orderPrice', 'discount', 'paymentMethod']),
) {}

export class OrderResponseDto extends PartialType(OrderDto) {
  @ApiProperty({ type: [ProductResponseDto] })
  products: ProductResponseDto[];

  @ApiProperty({ type: ResponseCustomerDto })
  customer: ResponseCustomerDto;
}
