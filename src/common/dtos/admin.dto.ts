import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  ChangeUserInfoDto,
  ChangeUserPasswordDto,
  CreateUserDto,
  LoginUserDto,
  ResponseUserDto,
} from './user.dto';
import { AdminSortBy, AdminSortDir } from '@qaseh/enums';

class AdminDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  isSuperuser: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class LoginAdminDto extends LoginUserDto {}

class _CreateAdminDto extends PickType(AdminDto, ['fullName', 'isSuperuser']) {}

export class CreateAdminDto extends IntersectionType(
  _CreateAdminDto,
  CreateUserDto,
) {}

export class FilterAdminDto {
  @ApiProperty({
    description: 'Search the fullName and email of the admin',
    required: false,
  })
  query?: string;

  @ApiProperty({
    enum: Object.values(AdminSortBy),
    description: 'Sort admins based on their status',
    required: false,
    default: AdminSortBy.CreatedAt,
  })
  sortBy?: string;

  @ApiProperty({
    enum: Object.values(AdminSortDir),
    description: 'Sort admins based on their status',
    required: false,
    default: AdminSortDir.DESC,
  })
  sortDir?: 'ASC' | 'DESC';

  @ApiProperty({
    description: 'Specify the number of admins to be brought',
    required: false,
    default: 10,
  })
  take?: number;

  @ApiProperty({
    description: 'Specify the number of the page to be fetched',
    required: false,
    default: 1,
  })
  page?: number;
}

class _ChangeAdminInfoDto extends PartialType(
  PickType(AdminDto, ['fullName', 'imageUrl']),
) {}

export class ChangeAdminInfoDto extends IntersectionType(
  _ChangeAdminInfoDto,
  ChangeUserInfoDto,
) {}

export class ChangeAdminPasswordDto extends ChangeUserPasswordDto {}

class _ResponseAdminDto extends PickType(AdminDto, [
  'id',
  'fullName',
  'imageUrl',
  'createdAt',
  'updatedAt',
]) {}

export class ResponseAdminDto extends IntersectionType(
  _ResponseAdminDto,
  ResponseUserDto,
) {}
