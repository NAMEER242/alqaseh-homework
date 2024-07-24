import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { PaymentMethod } from '@qaseh/enums';
import { ProductResponseDto } from './product.dto';
import { ResponseCustomerDto } from './cusotmer.dto';

export class OrderDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderPrice: number;

  @ApiProperty()
  paymentMethod: PaymentMethod;

  @ApiProperty()
  purchasedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateCustomerOrderDto extends PickType(OrderDto, [
  'paymentMethod',
]) {
  @ApiProperty({ type: Number, isArray: true })
  productIds: number[];
}

export class UpdateCustomerOrderDto extends PartialType(
  PickType(OrderDto, ['paymentMethod']),
) {
  @ApiProperty({ type: Number, isArray: true })
  productIds: number[];
}

export class UpdateAdminOrderDto extends PartialType(
  PickType(OrderDto, ['paymentMethod']),
) {
  @ApiProperty({ type: Number, isArray: true })
  productIds: number[];
}

export class CreateOrderDto extends PickType(OrderDto, [
  'paymentMethod',
  'orderPrice',
]) {
  @ApiProperty({ type: Number, isArray: true })
  productIds: number[];
}

export class UpdateOrderDto extends PartialType(
  PickType(OrderDto, ['orderPrice', 'paymentMethod']),
) {
  @ApiProperty({ type: Number, isArray: true })
  productIds: number[];
}

export class OrderResponseDto extends PartialType(OrderDto) {
  @ApiProperty({ type: [ProductResponseDto] })
  products: ProductResponseDto[];

  @ApiProperty({ type: ResponseCustomerDto })
  customer: ResponseCustomerDto;
}

export class OrderFilterDto {
  @ApiProperty({ description: 'filter by customer id', required: false })
  customerId: number;

  @ApiProperty({
    description: 'filter by payment method',
    enum: ['All', ...Object.values(PaymentMethod)],
    default: 'All',
    required: false,
  })
  paymentMethod: string;

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

export class CustomerOrderFilterDto extends OmitType(OrderFilterDto, [
  'customerId',
]) {}
