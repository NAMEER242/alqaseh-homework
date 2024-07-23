import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity, UserEntity } from '@qaseh/entities';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  ChangeCustomerInfoDto,
  CreateCustomerDto,
  FilterCustomerDto,
} from '@qaseh/dtos';
import { CustomerSortBy } from '@qaseh/enums';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    const customer = new CustomerEntity();
    customer.user = new UserEntity();

    this.customerRepository.merge(customer, createCustomerDto);
    this.customerRepository.manager.merge(
      UserEntity,
      customer.user,
      createCustomerDto,
    );

    return await this.customerRepository.save(customer);
  }

  async getAllCustomers(
    filter: FilterCustomerDto,
  ): Promise<{ customers: CustomerEntity[]; count: number }> {
    const query = this.customerRepository.createQueryBuilder('customer');

    this.applySearchFilter(query, filter.query);
    this.applySortingAndPagination(query, filter);

    const [customers, count] = await query.getManyAndCount();

    return { customers, count };
  }

  async getCustomer(id: number): Promise<CustomerEntity> {
    return await this.customerRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
  }

  async getAdminByUserId(id: number): Promise<CustomerEntity> {
    return await this.customerRepository.findOne({
      where: {
        user: { id: id },
      },
      relations: { user: true },
    });
  }

  async getCustomerByUserId(id: number): Promise<CustomerEntity> {
    return await this.customerRepository.findOne({
      where: {
        user: {
          id: id,
        },
      },
      relations: { user: true },
    });
  }

  async changeCustomerInfo(
    customer: CustomerEntity,
    changeCustomerInfoDto: ChangeCustomerInfoDto,
  ): Promise<CustomerEntity> {
    this.customerRepository.merge(customer, changeCustomerInfoDto);
    this.customerRepository.manager.merge(
      UserEntity,
      customer.user,
      changeCustomerInfoDto,
    );

    return await this.customerRepository.save(customer);
  }

  async updateCustomerPassword(
    customer: CustomerEntity,
    password: string,
  ): Promise<boolean> {
    const result = await this.customerRepository.manager.update(
      UserEntity,
      { id: customer.user.id },
      { password: password },
    );

    return !!result.affected;
  }

  async DeleteCustomer(id: number): Promise<boolean> {
    const result = await this.customerRepository.delete(id);

    return !!result.affected;
  }

  private applySearchFilter(
    query: SelectQueryBuilder<CustomerEntity>,
    searchTerm: string,
  ): void {
    if (searchTerm) {
      query
        .andWhere('customer.fullName LIKE :query', { query: `%${searchTerm}%` })
        .leftJoinAndSelect('customer.user', 'user', 'user.email LIKE :query', {
          query: `%${searchTerm}%`,
        });
    } else {
      query.leftJoinAndSelect('customer.user', 'user');
    }
  }

  private applySortingAndPagination(
    query: SelectQueryBuilder<CustomerEntity>,
    filter: FilterCustomerDto,
  ): void {
    const alias = this.getSortingAlias(filter.sortBy);

    query
      .orderBy(`${alias}.${filter.sortBy}`, filter.sortDir)
      .take(filter.take)
      .skip((filter.page - 1) * filter.take);
  }

  private getSortingAlias(sortBy: string): string {
    return sortBy === CustomerSortBy.Email ? 'user' : 'customer';
  }
}
