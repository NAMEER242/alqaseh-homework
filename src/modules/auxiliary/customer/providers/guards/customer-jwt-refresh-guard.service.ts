import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @class CustomerJwtRefreshGuard
 *
 * @description
 * Handles JWT refresh token authentication in NestJS applications. Extends the built-in AuthGuard from NestJS Passport
 * and provides custom behavior for authentication.
 *
 * @public
 *
 * @extends AuthGuard
 */
@Injectable()
export class CustomerJwtRefreshGuard extends AuthGuard('customer-jwt-refresh') {}
