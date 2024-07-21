import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get envPath(): string {
    return this.configService.get('APP_ENV_PATH', '.env');
  }

  get port(): number {
    return Number(this.configService.get('APP_PORT', 3000));
  }
}
