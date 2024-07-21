import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  ChangeUserInfoDto,
  ChangeUserPasswordDto,
  CreateUserDto,
  LoginUserDto,
  ResponseUserDto,
} from './user.dto';
import { CustomerSortBy, CustomerSortDir } from '@qaseh/enums';

class CustomerDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}

export class LoginCustomerDto extends LoginUserDto {}

class _CreateCustomerDto extends PickType(CustomerDto, ['fullName']) {}

export class CreateCustomerDto extends IntersectionType(
  _CreateCustomerDto,
  CreateUserDto,
) {}

export class FilterCustomerDto {
  @ApiProperty({
    description: 'Search the fullName and email of the customer',
    required: false,
  })
  query?: string;

  @ApiProperty({
    enum: Object.values(CustomerSortBy),
    description: 'Sort customers based on their status',
    required: false,
    default: CustomerSortBy.CreatedAt,
  })
  sortBy?: string;

  @ApiProperty({
    enum: Object.values(CustomerSortDir),
    description: 'Sort customers based on their status',
    required: false,
    default: CustomerSortDir.DESC,
  })
  sortDir?: 'ASC' | 'DESC';

  @ApiProperty({
    description: 'Specify the number of customers to be brought',
    required: false,
    default: 10,
  })
  take?: number;

  @ApiProperty({
    description: 'Specify the number of the page to be fetched',
    required: false,
    default: 1,
  })
  page?: number;
}

class _ChangeCustomerInfoDto extends PartialType(
  PickType(CustomerDto, ['fullName', 'imageUrl']),
) {}

export class ChangeCustomerInfoDto extends IntersectionType(
  _ChangeCustomerInfoDto,
  ChangeUserInfoDto,
) {}

export class ChangeCustomerPasswordDto extends ChangeUserPasswordDto {}

class _ResponseCustomerDto extends PickType(CustomerDto, [
  'id',
  'fullName',
  'imageUrl',
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}

export class ResponseCustomerDto extends IntersectionType(
  _ResponseCustomerDto,
  ResponseUserDto,
) {}
