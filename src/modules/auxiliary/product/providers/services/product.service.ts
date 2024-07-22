import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '@qaseh/entities';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '@qaseh/dtos';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getAll() {
    const query = this.productRepository.createQueryBuilder('product');

    const [customers, count] = await query.getManyAndCount();
    return { customers, count };
  }

  async get(id: number) {
    return await this.productRepository.findOneBy({
      id: id,
    });
  }

  async create(productDto: CreateProductDto) {
    const product = this.productRepository.create(productDto);
    if (!product) return null;
    return await this.productRepository.save(product);
  }

  async update(id: number, productDto: UpdateProductDto) {
    let product = await this.productRepository.findOneBy({
      id: id,
    });
    if (!product) return null;

    product = this.productRepository.merge(product, productDto);

    return await this.productRepository.save(product);
  }

  async delete(id: number) {
    const res = await this.productRepository.delete(id);
    return !!res.affected;
  }
}
