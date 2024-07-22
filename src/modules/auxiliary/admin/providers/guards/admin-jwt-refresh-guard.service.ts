import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @class AdminJwtRefreshGuard
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
export class AdminJwtRefreshGuard extends AuthGuard('jwt-refresh') {}
