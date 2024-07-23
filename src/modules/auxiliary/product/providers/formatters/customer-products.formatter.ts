import { Injectable } from '@nestjs/common';
import { BaseFormatter } from '@qaseh/modules/formatter';
import { ProductEntity } from '@qaseh/entities';
import { CustomerProductResponseDto } from '@qaseh/dtos';
import { AdminFormatter } from '../../../admin/providers/formatters/admin.formatter';
import { ProductAvailabilityStatus } from '@qaseh/enums';

@Injectable()
export class CustomerProductsFormatter extends BaseFormatter<
  ProductEntity,
  CustomerProductResponseDto
> {
  getAvailabilityStatus(quantity: number): ProductAvailabilityStatus {
    if (!quantity) return ProductAvailabilityStatus.LOW;
    if (quantity < 5) {
      return ProductAvailabilityStatus.LOW;
    } else if (quantity < 10) {
      return ProductAvailabilityStatus.LIMITED;
    } else {
      return ProductAvailabilityStatus.AVAILABLE;
    }
  }

  constructor() {
    super((product: ProductEntity): CustomerProductResponseDto => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: this.getAvailabilityStatus(product.quantity),
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
