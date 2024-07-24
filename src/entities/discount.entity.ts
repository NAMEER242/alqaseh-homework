import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('discounts')
export class DiscountEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'total_price_limit', type: 'int', unsigned: true })
  totalPriceLimit: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  value: number;

  @Column({ name: 'is_used', type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ name: 'expired_at', type: 'timestamp' })
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => OrderEntity, (order) => order.discount)
  @JoinColumn({ name: 'orderId_id' })
  order: OrderEntity;
}
