import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { ProductCategory } from '@qaseh/enums';
import { ResponseAdminDto } from './admin.dto';

export class ProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  category: ProductCategory;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateProductDto extends PickType(ProductDto, [
  'name',
  'price',
  'quantity',
  'category',
]) {}

export class UpdateProductDto extends PartialType(
  PickType(ProductDto, ['name', 'price', 'quantity', 'category']),
) {}

export class ProductResponseDto extends PartialType(ProductDto) {
  @ApiProperty()
  createdBy: ResponseAdminDto;

  @ApiProperty()
  updatedBy: ResponseAdminDto;
}

export class ProductFilterDto {
  @ApiProperty({ required: false, description: 'search by name' })
  query: string;

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
