import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SuperuserConfigService {
  constructor(private readonly configService: ConfigService) {}

  get superuserEmail(): string {
    return this.configService.get('SUPERUSER_EMAIL');
  }

  get superuserPassword(): string {
    return this.configService.get('SUPERUSER_PASS');
  }
}
