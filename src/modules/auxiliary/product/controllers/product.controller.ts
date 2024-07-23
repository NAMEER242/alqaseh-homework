import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  CreateProductDto,
  ProductFilterDto,
  ProductResponseDto,
  UpdateProductDto,
} from '@qaseh/dtos';
import { ProductService } from '../providers/services/product.service';
import { JoiValidatorPipe } from '@qaseh/pipes';
import {
  productCreateValidation,
  productFilterValidation,
  productUpdateValidation,
} from '../../../../common/validations/product.validation';
import { AdminJwtAccessGuard } from '../../admin/providers/guards/admin-jwt-access-guard.service';
import { ProductFormatter } from '../providers/formatters/product.formatter';
import { SuccessResponseFormatter } from '@qaseh/modules/formatter';
import { UserEntity } from '@qaseh/entities';
import { AdminService } from '../../admin/providers/services/admin.service';
import { CustomerJwtAccessGuard } from '../../customer/providers/guards/customer-jwt-access-guard.service';

@ApiTags('Product Management')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly adminService: AdminService,
    private readonly productFormatter: ProductFormatter,
    private readonly responseFormatter: SuccessResponseFormatter,
  ) {}

  @Get()
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(productFilterValidation))
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductResponseDto,
    isArray: true,
  })
  async getAll(@Req() req: any, @Query() filterDto: ProductFilterDto) {
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
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductResponseDto,
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

  @Post()
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(productCreateValidation))
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ProductResponseDto,
  })
  async create(@Req() req: any, @Body() productDto: CreateProductDto) {
    const isNotUnique = await this.productService.hasByName(productDto.name);
    if (isNotUnique) {
      throw new BadRequestException('Product name is not unique');
    }

    const user: UserEntity = req.user;
    const admin = await this.adminService.getAdminByUserId(user.id);
    const product = await this.productService.create(admin, productDto);

    if (!product) {
      throw new BadRequestException('Product creation failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.productFormatter.formatOne(product),
      status: HttpStatus.CREATED,
    });
  }

  @Patch(':id')
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(productUpdateValidation))
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductResponseDto,
  })
  async update(
    @Req() req: any,
    @Param('id') id: number,
    @Body() productDto: UpdateProductDto,
  ) {
    const user: UserEntity = req.user;
    const admin = await this.adminService.getAdminByUserId(user.id);
    const product = await this.productService.update(id, admin, productDto);

    if (!product) {
      throw new BadRequestException('Product Update failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.productFormatter.formatOne(product),
      status: HttpStatus.OK,
    });
  }

  @Delete(':id')
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async delete(@Req() req: any, @Param('id') id: number) {
    const result = this.productService.delete(id);

    if (!result) {
      throw new NotFoundException('Product not found');
    }

    return this.responseFormatter.format({
      req: req,
      status: HttpStatus.NO_CONTENT,
    });
  }
}
