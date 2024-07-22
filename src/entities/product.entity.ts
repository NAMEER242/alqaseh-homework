import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { AdminEntity } from './admin.entity';
import { ProductCategory } from '@qaseh/enums';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'int', unsigned: true })
  price: number;

  @Column({ type: 'int', unsigned: true })
  quantity: number;

  @Column({ type: 'enum', enum: ProductCategory })
  category: ProductCategory;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => AdminEntity)
  @JoinColumn({ name: 'created_by' })
  createdBy: AdminEntity;

  @ManyToOne(() => AdminEntity)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: AdminEntity;
}
