import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private readonly configService: ConfigService) {}

  get jwtSecretUserAccess(): string {
    return this.configService.get('JWT_SECRET_USER_ACCESS');
  }

  get jwtTTLUserAccess(): number {
    return Number(this.configService.get('JWT_TTL_USER_ACCESS'));
  }

  get jwtSecretUserRefresh(): string {
    return this.configService.get('JWT_SECRET_USER_REFRESH');
  }

  get jwtTTLUserRefresh(): number {
    return Number(this.configService.get('JWT_TTL_USER_REFRESH'));
  }
}
