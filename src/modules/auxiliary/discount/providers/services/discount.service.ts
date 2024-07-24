import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from '@qaseh/entities';
import { Repository } from 'typeorm';
import {
  CreateDiscountDto,
  DiscountFilterDto,
  UpdateDiscountDto,
} from '@qaseh/dtos';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
  ) {}

  async getAll(filter: DiscountFilterDto) {
    const query = this.discountRepository.createQueryBuilder('discount');
    query.skip((filter.page - 1) * filter.limit).take(filter.limit);

    const [discounts, count] = await query.getManyAndCount();
    return { discounts, count };
  }

  async get(id: number) {
    return await this.discountRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async hasByCode(code: string) {
    return await this.discountRepository.exists({
      where: {
        code: code,
      },
    });
  }

  async getByCode(code: string) {
    return await this.discountRepository.findOne({
      where: {
        code: code,
      },
    });
  }

  generateRandomString() {
    const characters =
      'ABCDEFGHIJKLMNOabcdefghijklmno0123456789PQRSTUVWXYZpqrstuvwxyz';
    const codeLength = 8;
    let result = '';
    for (let i = 0; i < codeLength; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  async create(discountDto: CreateDiscountDto) {
    const discount = this.discountRepository.create(discountDto);
    discount.code = this.generateRandomString();
    const isNotUnique = await this.hasByCode(discount.code);
    if (isNotUnique) return null;
    return await this.discountRepository.save(discount);
  }

  async update(id: number, discountDto: UpdateDiscountDto) {
    let discount = await this.discountRepository.findOneBy({
      id: id,
    });
    discount = this.discountRepository.merge(discount, discountDto);
    return await this.discountRepository.save(discount);
  }

  async delete(id: number) {
    const res = await this.discountRepository.delete(id);
    return !!res.affected;
  }
}
