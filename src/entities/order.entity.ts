import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  Column,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { PaymentMethod } from '@qaseh/enums';
import { CustomerEntity } from './customer.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'order_price', type: 'int', unsigned: true })
  orderPrice: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  discount: number;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({ name: 'purchased_at', type: 'timestamp', nullable: true })
  purchasedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => ProductEntity)
  @JoinTable({ name: 'orders_products' })
  products: ProductEntity[];

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;
}
