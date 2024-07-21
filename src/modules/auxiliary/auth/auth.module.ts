import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@qaseh/entities';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@qaseh/modules/config';
import { JwtAccessGuard } from './providers/guards/jwt-access.guard';
import { JwtRefreshGuard } from './providers/guards/jwt-refresh.guard';
import { JwtAccessStrategy } from './providers/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './providers/strategies/jwt-refresh.strategy';
import { HelperService } from './providers/services/helper.service';
import { AuthService } from './providers/services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule,
    ConfigModule,
  ],
  providers: [
    JwtAccessGuard,
    JwtRefreshGuard,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    HelperService,
    AuthService,
  ],
  exports: [
    JwtAccessGuard,
    JwtRefreshGuard,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    HelperService,
    AuthService,
  ],
})
export class AuthModule {}
