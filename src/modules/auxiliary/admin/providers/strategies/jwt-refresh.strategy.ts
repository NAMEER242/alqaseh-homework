import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfigService } from '@qaseh/modules/config';
import { JwtRefreshPayloadDto } from '@qaseh/dtos';
import { UserEntity } from '@qaseh/entities';
import { AuthService } from '../../../auth/providers/services/auth.service';
import { AdminService } from '../services/admin.service';

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
    private readonly adminService: AdminService,
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
    const admin = await this.adminService.getAdminByUserId(user.id);

    if (!user && !admin) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
