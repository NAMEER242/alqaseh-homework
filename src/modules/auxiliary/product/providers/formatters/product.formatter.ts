import { Injectable } from '@nestjs/common';
import { BaseFormatter } from '@qaseh/modules/formatter';
import { ProductEntity } from '@qaseh/entities';
import { ProductResponseDto } from '@qaseh/dtos';
import { AdminFormatter } from '../../../admin/providers/formatters/admin.formatter';

@Injectable()
export class ProductFormatter extends BaseFormatter<
  ProductEntity,
  ProductResponseDto
> {
  constructor() {
    super((product: ProductEntity): ProductResponseDto => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
        createdBy: product.createdBy
          ? new AdminFormatter().formatOne(product.createdBy)
          : null,
        updatedBy: product.updatedBy
          ? new AdminFormatter().formatOne(product.updatedBy)
          : null,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });
  }
}
