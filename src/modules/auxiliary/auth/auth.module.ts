import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@qaseh/entities';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@qaseh/modules/config';
import { HelperService } from './providers/services/helper.service';
import { AuthService } from './providers/services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule,
    ConfigModule,
  ],
  providers: [HelperService, AuthService],
  exports: [HelperService, AuthService],
})
export class AuthModule {}
