import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateUserDto extends PickType(UserDto, ['email', 'password']) {}

export class LoginUserDto extends PickType(UserDto, ['email', 'password']) {}

export class ChangeUserInfoDto extends PartialType(
  PickType(UserDto, ['email', 'imageUrl']),
) {}

export class ResponseUserDto extends PickType(UserDto, ['email']) {}

export class ChangeUserPasswordDto {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}
