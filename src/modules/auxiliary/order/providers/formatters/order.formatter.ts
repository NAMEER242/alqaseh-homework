import { Injectable } from '@nestjs/common';
import { BaseFormatter } from '@qaseh/modules/formatter';
import { OrderEntity } from '@qaseh/entities';
import { OrderResponseDto } from '@qaseh/dtos';
import { CustomerFormatter } from '../../../customer/providers/formatters/customer.formatter';
import { ProductFormatter } from '../../../product';

@Injectable()
export class OrderFormatter extends BaseFormatter<
  OrderEntity,
  OrderResponseDto
> {
  constructor() {
    super((order: OrderEntity): OrderResponseDto => {
      return {
        id: order.id,
        orderPrice: order.orderPrice,
        customer: order.customer
          ? new CustomerFormatter().formatOne(order.customer)
          : null,
        products: order.products
          ? new ProductFormatter().formatAll(order.products)
          : null,
        paymentMethod: order.paymentMethod,
        purchasedAt: order.purchasedAt,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });
  }
}
