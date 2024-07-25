import { OrderEntity } from '@qaseh/entities';

export function getFinalOrderPrice(order: OrderEntity) {
  if (order.discount) {
    return order.discount.value < order.orderPrice
      ? order.orderPrice - order.discount.value
      : 0;
  } else {
    return order.orderPrice;
  }
}
