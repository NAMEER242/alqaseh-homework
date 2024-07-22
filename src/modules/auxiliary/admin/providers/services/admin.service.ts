import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity, UserEntity } from '@qaseh/entities';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  ChangeAdminInfoDto,
  CreateAdminDto,
  FilterAdminDto,
} from '@qaseh/dtos';
import { AdminSortBy } from '@qaseh/enums';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<AdminEntity> {
    const admin = new AdminEntity();
    admin.user = new UserEntity();

    this.adminRepository.merge(admin, createAdminDto);
    this.adminRepository.manager.merge(UserEntity, admin.user, createAdminDto);

    return await this.adminRepository.save(admin);
  }

  async getAllAdmins(
    filter: FilterAdminDto,
  ): Promise<{ admins: AdminEntity[]; count: number }> {
    const query = this.adminRepository.createQueryBuilder('admin');

    this.applySearchFilter(query, filter.query);
    this.applySortingAndPagination(query, filter);

    const [admins, count] = await query.getManyAndCount();

    return { admins, count };
  }

  async getAdmin(id: number): Promise<AdminEntity> {
    return await this.adminRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
  }

  async getAdminByUserId(id: number): Promise<AdminEntity> {
    return await this.adminRepository.findOne({
      where: {
        user: {
          id: id,
        },
      },
      relations: { user: true },
    });
  }

  async getSuperuser(): Promise<AdminEntity> {
    return await this.adminRepository.findOne({
      where: {
        isSuperuser: true,
      },
      relations: { user: true },
    });
  }

  async changeAdminInfo(
    admin: AdminEntity,
    changeAdminInfoDto: ChangeAdminInfoDto,
  ): Promise<AdminEntity> {
    this.adminRepository.merge(admin, changeAdminInfoDto);
    this.adminRepository.manager.merge(
      UserEntity,
      admin.user,
      changeAdminInfoDto,
    );

    return await this.adminRepository.save(admin);
  }

  async updateAdminPassword(
    admin: AdminEntity,
    password: string,
  ): Promise<boolean> {
    const result = await this.adminRepository.manager.update(
      UserEntity,
      { id: admin.user.id },
      { password: password },
    );

    return !!result.affected;
  }

  async DeleteAdmin(id: number): Promise<boolean> {
    const result = await this.adminRepository.delete(id);

    return !!result.affected;
  }

  private applySearchFilter(
    query: SelectQueryBuilder<AdminEntity>,
    searchTerm: string,
  ): void {
    if (searchTerm) {
      query
        .andWhere('admin.fullName LIKE :query', { query: `%${searchTerm}%` })
        .leftJoinAndSelect('admin.user', 'user', 'user.email LIKE :query', {
          query: `%${searchTerm}%`,
        });
    } else {
      query.leftJoinAndSelect('admin.user', 'user');
    }
  }

  private applySortingAndPagination(
    query: SelectQueryBuilder<AdminEntity>,
    filter: FilterAdminDto,
  ): void {
    const alias = this.getSortingAlias(filter.sortBy);

    query
      .orderBy(`${alias}.${filter.sortBy}`, filter.sortDir)
      .take(filter.take)
      .skip((filter.page - 1) * filter.take);
  }

  private getSortingAlias(sortBy: string): string {
    return sortBy === AdminSortBy.Email ? 'user' : 'admin';
  }
}
