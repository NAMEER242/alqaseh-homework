import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  Column,
  OneToOne, OneToMany,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { PaymentMethod } from '../common/enums/order.enum';
import { CustomerEntity } from './customer.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'order_price', type: 'int', unsigned: true })
  orderPrice: number;

  @Column({ type: 'int', unsigned: true })
  discount: number;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({ name: 'purchased_at', type: 'timestamp' })
  purchasedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => ProductEntity)
  products: ProductEntity;

  @ManyToMany(() => CustomerEntity, (customer) => customer.orders)
  customer: CustomerEntity[];
}
