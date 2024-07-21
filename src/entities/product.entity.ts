import {
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { AdminEntity } from './admin.entity';
import { ProductCategory } from '@qaseh/enums';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int', unsigned: true })
  price: number;

  @Column({ type: 'int', unsigned: true })
  quantity: number;

  @Column({ type: 'enum', enum: ProductCategory })
  category: ProductCategory;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => AdminEntity)
  @JoinColumn({ name: 'created_by' })
  createdBy: AdminEntity;

  @OneToOne(() => AdminEntity)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: AdminEntity;
}
