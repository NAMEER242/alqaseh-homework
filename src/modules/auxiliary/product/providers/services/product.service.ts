import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity, ProductEntity } from '@qaseh/entities';
import { In, Repository } from 'typeorm';
import {
  CreateProductDto,
  ProductFilterDto,
  UpdateProductDto,
} from '@qaseh/dtos';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getAll(filter: ProductFilterDto) {
    const query = this.productRepository.createQueryBuilder('product');

    if (filter.query) {
      query.where('(product.name LIKE :query)', {
        query: `%${filter.query}%`,
      });
    }

    if (filter.category && filter.category != 'All') {
      query.where('(product.category IS :query)', {
        query: `%${filter.category}%`,
      });
    }

    query
      .leftJoinAndSelect('product.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.user', 'createdByUser')
      .leftJoinAndSelect('product.updatedBy', 'updatedBy')
      .leftJoinAndSelect('updatedBy.user', 'updatedByUser');
    query.skip((filter.page - 1) * filter.limit).take(filter.limit);

    const [products, count] = await query.getManyAndCount();
    return { products, count };
  }

  async get(id: number) {
    return await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        createdBy: { user: true },
        updatedBy: { user: true },
      },
    });
  }

  async getByIds(ids: number[]) {
    return await this.productRepository.find({
      where: {
        id: In(ids),
      },
      relations: {
        createdBy: { user: true },
        updatedBy: { user: true },
      },
    });
  }

  async hasByName(name: string): Promise<boolean> {
    return await this.productRepository.exists({
      where: {
        name: name,
      },
    });
  }

  async create(createdBy: AdminEntity, productDto: CreateProductDto) {
    const product = this.productRepository.create(productDto);
    if (!product || !createdBy) return null;
    product.createdBy = createdBy;
    return await this.productRepository.save(product);
  }

  async update(
    id: number,
    updatedBy: AdminEntity,
    productDto: UpdateProductDto,
  ) {
    let product = await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        createdBy: { user: true },
        updatedBy: { user: true },
      },
    });
    if (!product || !updatedBy) return null;
    product.updatedBy = updatedBy;
    product = this.productRepository.merge(product, productDto);
    return await this.productRepository.save(product);
  }

  async delete(id: number) {
    const res = await this.productRepository.delete(id);
    return !!res.affected;
  }
}
