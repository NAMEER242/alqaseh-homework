import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { PaymentMethod } from '@qaseh/enums';
import { ProductResponseDto } from './product.dto';
import { ResponseCustomerDto } from './cusotmer.dto';
import { number } from 'joi';

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
]) {
  @ApiProperty({ type: Number, isArray: true })
  productIds: number[];
}

export class UpdateOrderDto extends PartialType(
  PickType(OrderDto, ['orderPrice', 'discount', 'paymentMethod']),
) {
  @ApiProperty({ type: [number] })
  productIds: number[];
}

export class OrderResponseDto extends PartialType(OrderDto) {
  @ApiProperty({ type: [ProductResponseDto] })
  products: ProductResponseDto[];

  @ApiProperty({ type: ResponseCustomerDto })
  customer: ResponseCustomerDto;
}

export class OrderFilterDto {
  @ApiProperty({
    description: 'Limit the number of content that can be brought.',
    required: false,
    default: 10,
  })
  limit?: number;

  @ApiProperty({
    description: 'Specify the number of the page to be fetched.',
    required: false,
    default: 1,
  })
  page?: number;
}
