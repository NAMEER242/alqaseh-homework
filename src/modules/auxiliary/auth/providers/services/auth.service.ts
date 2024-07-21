import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@qaseh/entities';
import { EntityManager, Repository } from 'typeorm';
import {
  CreateUserDto,
  JwtAccessPayloadDto,
  JwtRefreshPayloadDto,
} from '@qaseh/dtos';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async isExists(email: string): Promise<boolean> {
    return await this.userRepository.existsBy({ email: email });
  }

  async createUser(
    createUserDto: CreateUserDto,
    manager?: EntityManager,
  ): Promise<UserEntity> {
    manager = manager ?? this.userRepository.manager;
    const user = this.userRepository.create(createUserDto);

    return await manager.save(user);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({
      email: email,
    });
  }

  async getUserByJwtPayload(
    jwtPayloadDto: JwtRefreshPayloadDto | JwtAccessPayloadDto,
  ): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: jwtPayloadDto.subUser });
  }
}
