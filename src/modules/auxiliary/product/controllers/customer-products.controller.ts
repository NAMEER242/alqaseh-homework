import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CustomerProductResponseDto, ProductFilterDto } from '@qaseh/dtos';
import { ProductService } from '../providers/services/product.service';
import { JoiValidatorPipe } from '@qaseh/pipes';
import { productFilterValidation } from '@qaseh/validations';
import { SuccessResponseFormatter } from '@qaseh/modules/formatter';
import { CustomerJwtAccessGuard } from '../../customer/providers/guards/customer-jwt-access-guard.service';
import { CustomerProductsFormatter } from '../providers/formatters/customer-products.formatter';

@ApiTags('Products')
@Controller('customer/products')
export class CustomerProductsController {
  constructor(
    private readonly productService: ProductService,
    private readonly productFormatter: CustomerProductsFormatter,
    private readonly responseFormatter: SuccessResponseFormatter,
  ) {}

  @Get()
  @UseGuards(CustomerJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(productFilterValidation))
  @ApiResponse({
    status: HttpStatus.OK,
    type: CustomerProductResponseDto,
    isArray: true,
  })
  async customerGetAllProducts(
    @Req() req: any,
    @Query() filterDto: ProductFilterDto,
  ) {
    const { products, count } = await this.productService.getAll(filterDto);

    if (!products) {
      throw new BadRequestException('Failed to get all products');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.productFormatter.formatAll(products),
      count: count,
      status: HttpStatus.OK,
    });
  }

  @Get(':id')
  @UseGuards(CustomerJwtAccessGuard)
  @ApiBearerAuth('Access')
  @ApiResponse({
    status: HttpStatus.OK,
    type: CustomerProductResponseDto,
  })
  async get(@Req() req: any, @Param('id') id: number) {
    const product = await this.productService.get(id);

    if (!product) {
      throw new BadRequestException('Failed to get the product');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.productFormatter.formatOne(product),
      status: HttpStatus.OK,
    });
  }
}
