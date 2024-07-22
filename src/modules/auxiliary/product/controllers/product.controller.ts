import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@qaseh/dtos';
import { ProductService } from '../providers/services/product.service';

@ApiTags('Product Management')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll() {
    const products = await this.productService.getAll();
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    const product = await this.productService.get(id);
  }

  @Post()
  async create(@Body() productDto: CreateProductDto) {
    const product = await this.productService.create(productDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() productDto: UpdateProductDto) {
    const product = await this.productService.update(id, productDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = this.productService.delete(id);
  }
}
