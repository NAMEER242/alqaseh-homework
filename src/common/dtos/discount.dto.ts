import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

export class DiscountDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  totalPriceLimit: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  isUsed: boolean;

  @ApiProperty()
  code: string;

  @ApiProperty()
  expiredAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateDiscountDto extends PickType(DiscountDto, [
  'expiredAt',
  'totalPriceLimit',
  'value',
]) {}

export class UpdateDiscountDto extends PartialType(
  PickType(DiscountDto, ['expiredAt', 'totalPriceLimit', 'value']),
) {}

export class ResponseDiscountDto extends PartialType(DiscountDto) {}

export class DiscountFilterDto {
  @ApiProperty({
    description: 'Limit the number of content that can be brought.',
    required: false,
    default: 10,
  })
  limit?: number;

  @ApiProperty({
    description: 'Specify the number of the page to be fetched.',
    required: false,
    default: 1,
  })
  page?: number;
}
