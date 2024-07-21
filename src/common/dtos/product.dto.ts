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
