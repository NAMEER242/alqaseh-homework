import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfigService } from '@qaseh/modules/config';
import { JwtRefreshPayloadDto } from '@qaseh/dtos';
import { UserEntity } from '@qaseh/entities';
import { AuthService } from '../services/auth.service';

/**
 * @class JwtRefreshStrategy
 *
 * @description
 * This strategy is used for JWT refresh token authentication for user accounts in NestJS applications. It extends PassportStrategy
 * and is configured to use the 'jwt-refresh' strategy. The validate method checks the provided JWT refresh payload and
 * returns the authenticated user entity or throws an UnauthorizedException if the token is invalid or expired.
 *
 * @public
 *
 * @extends PassportStrategy
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly userService: AuthService,
    jwtConfigService: JwtConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfigService.jwtSecretUserRefresh,
      ignoreExpiration: false,
    });
  }

  async validate(jwtPayloadDto: JwtRefreshPayloadDto): Promise<UserEntity> {
    const user = await this.userService.getUserByJwtPayload(jwtPayloadDto);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
