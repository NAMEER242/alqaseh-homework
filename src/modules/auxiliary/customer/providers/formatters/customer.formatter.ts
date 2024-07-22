import { Injectable } from '@nestjs/common';
import { BaseFormatter } from '@qaseh/modules/formatter';
import { CustomerEntity } from '@qaseh/entities';
import { ResponseCustomerDto } from '@qaseh/dtos';

@Injectable()
export class CustomerFormatter extends BaseFormatter<
  CustomerEntity,
  ResponseCustomerDto
> {
  constructor() {
    super((customer: CustomerEntity): ResponseCustomerDto => {
      return {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.user.email,
        imageUrl: customer.imageUrl,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      };
    });
  }
}
