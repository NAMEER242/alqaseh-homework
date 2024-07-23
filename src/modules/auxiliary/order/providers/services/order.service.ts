import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity, OrderEntity, ProductEntity } from '@qaseh/entities';
import { Repository } from 'typeorm';
import { CreateOrderDto, OrderFilterDto, UpdateOrderDto } from '@qaseh/dtos';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async getAll(filter: OrderFilterDto) {
    const query = this.orderRepository.createQueryBuilder('order');

    query
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('order.products', 'products');
    query.skip((filter.page - 1) * filter.limit).take(filter.limit);

    const [orders, count] = await query.getManyAndCount();
    return { orders, count };
  }

  async getAllCustomerOrders(customerId: number, filter: OrderFilterDto) {
    const query = this.orderRepository.createQueryBuilder('order');

    query
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('order.products', 'products');
    query.where('customer.id = :id', { id: customerId });
    query.skip((filter.page - 1) * filter.limit).take(filter.limit);

    const [orders, count] = await query.getManyAndCount();
    return { orders, count };
  }

  async get(id: number) {
    return await this.orderRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        customer: { user: true },
        products: true,
      },
    });
  }

  async create(
    customer: CustomerEntity,
    products: ProductEntity[],
    orderDto: CreateOrderDto,
  ) {
    const order = this.orderRepository.create(orderDto);
    if (!order || !customer) return null;
    order.customer = customer;
    order.products = products;
    return await this.orderRepository.save(order);
  }

  async update(
    id: number,
    customer: CustomerEntity,
    products: ProductEntity[],
    orderDto: UpdateOrderDto,
  ) {
    let order = await this.orderRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        customer: { user: true },
        products: true,
      },
    });
    if (!order) return null;
    if (customer && order.customer.id != customer.id) return null;
    order = this.orderRepository.merge(order, orderDto);
    order.products = products;
    return await this.orderRepository.save(order);
  }

  async delete(id: number) {
    const res = await this.orderRepository.delete(id);
    return !!res.affected;
  }
}