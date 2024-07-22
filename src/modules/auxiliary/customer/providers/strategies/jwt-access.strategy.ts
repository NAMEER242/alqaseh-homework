import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../../auth/providers/services/auth.service';
import { JwtConfigService } from '@qaseh/modules/config';
import { JwtAccessPayloadDto } from '@qaseh/dtos';
import { UserEntity } from '@qaseh/entities';
import { CustomerService } from '../services/customer.service';

/**
 * @class JwtAccessStrategy
 *
 * @description
 * This strategy is used for JWT access token authentication for user accounts in NestJS applications. It extends PassportStrategy
 * and is configured to use the 'jwt-access' strategy. The validate method checks the provided JWT access payload and returns
 * the authenticated user entity or throws an UnauthorizedException if the token is invalid or expired.
 *
 * @public
 *
 * @extends PassportStrategy
 */
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'customer-jwt-access',
) {
  constructor(
    private readonly userService: AuthService,
    private readonly customerService: CustomerService,
    jwtConfigService: JwtConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfigService.jwtSecretUserAccess,
      ignoreExpiration: false,
    });
  }

  async validate(jwtPayloadDto: JwtAccessPayloadDto): Promise<UserEntity> {
    const user = await this.userService.getUserByJwtPayload(jwtPayloadDto);
    const customer = await this.customerService.getCustomerByUserId(user.id);

    if (!user || !customer) {
      throw new UnauthorizedException('Customer Unauthorized');
    }

    return user;
  }
}
