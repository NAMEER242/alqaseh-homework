import { ApiProperty } from '@nestjs/swagger';

export class JwtResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class JwtAccessPayloadDto {
  @ApiProperty()
  subUser: number;
}

export class JwtRefreshPayloadDto {
  @ApiProperty()
  subUser: number;
}
