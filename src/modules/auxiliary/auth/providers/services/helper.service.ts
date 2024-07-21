import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@qaseh/modules/config';
import { JwtResponseDto } from '@qaseh/dtos';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@qaseh/entities';

@Injectable()
export class HelperService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  async makePassword(plaintextPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return await bcrypt.hash(plaintextPassword, salt);
  }

  async checkPassword(
    plaintextPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plaintextPassword, encryptedPassword);
  }

  async generateJwtTokens(user: UserEntity): Promise<JwtResponseDto> {
    return {
      accessToken: await this.jwtService.signAsync(
        { subUser: user.id },
        {
          secret: this.jwtConfigService.jwtSecretUserAccess,
          expiresIn: this.jwtConfigService.jwtTTLUserAccess,
        },
      ),
      refreshToken: await this.jwtService.signAsync(
        { subUser: user.id },
        {
          secret: this.jwtConfigService.jwtSecretUserRefresh,
          expiresIn: this.jwtConfigService.jwtTTLUserRefresh,
        },
      ),
    };
  }
}
