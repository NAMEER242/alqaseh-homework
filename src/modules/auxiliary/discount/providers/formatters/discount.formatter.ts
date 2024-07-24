import { Injectable } from '@nestjs/common';
import { BaseFormatter } from '@qaseh/modules/formatter';
import { DiscountEntity } from '@qaseh/entities';
import { ResponseDiscountDto } from '@qaseh/dtos';

@Injectable()
export class DiscountFormatter extends BaseFormatter<
  DiscountEntity,
  ResponseDiscountDto
> {
  constructor() {
    super((discount: DiscountEntity): ResponseDiscountDto => {
      return {
        id: discount.id,
        code: discount.code,
        value: discount.value,
        totalPriceLimit: discount.totalPriceLimit,
        isUsed: discount.isUsed,
        expiredAt: discount.expiredAt,
        createdAt: discount.createdAt,
        updatedAt: discount.updatedAt,
      };
    });
  }
}
