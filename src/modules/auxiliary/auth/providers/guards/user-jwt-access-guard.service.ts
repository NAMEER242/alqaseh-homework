import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @class UserJwtAccessGuard
 *
 * @description
 * Handles JWT access token authentication in NestJS applications. Extends the built-in AuthGuard from NestJS Passport and
 * provides custom behavior for authentication.
 *
 * @public
 *
 * @extends AuthGuard
 */
@Injectable()
export class UserJwtAccessGuard extends AuthGuard('jwt-access') {}
