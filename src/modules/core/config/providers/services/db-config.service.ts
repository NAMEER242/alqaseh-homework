import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DBConfigService {
  private _prefix: string;

  constructor(private readonly configService: ConfigService) {}

  set prefix(value: string) {
    this._prefix = value;
  }

  get prefix(): string {
    return this._prefix;
  }

  get type(): string {
    return this.configService.get(`${this.prefix}` + 'DB_TYPE', 'mysql');
  }

  get host(): string {
    return this.configService.get(`${this.prefix}` + 'DB_HOST', 'localhost');
  }

  get port(): number {
    return Number(this.configService.get(`${this.prefix}` + 'DB_PORT', 3306));
  }

  get name(): string {
    return this.configService.get(`${this.prefix}` + 'DB_NAME', '');
  }

  get username(): string {
    return this.configService.get(`${this.prefix}` + 'DB_USERNAME', 'root');
  }

  get password(): string {
    return this.configService.get(`${this.prefix}` + 'DB_PASSWORD', 'root');
  }

  get isLogging(): boolean {
    return (
      this.configService.get(`${this.prefix}` + 'DB_LOGGING', false) === 'true'
    );
  }

  get isSynchronize(): boolean {
    return (
      this.configService.get(`${this.prefix}` + 'DB_SYNCHRONIZE', false) ===
      'true'
    );
  }

  get isAutoLoadEntities(): boolean {
    return (
      this.configService.get(
        `${this.prefix}` + 'DB_AUTO_LOAD_ENTITIES',
        false,
      ) === 'true'
    );
  }
}
