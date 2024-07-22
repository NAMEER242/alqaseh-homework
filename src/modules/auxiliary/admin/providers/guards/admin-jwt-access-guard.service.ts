import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @class AdminJwtAccessGuard
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
export class AdminJwtAccessGuard extends AuthGuard('admin-jwt-access') {}
