import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '@qaseh/entities';
import { ConfigModule } from '@qaseh/modules/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CustomerAccountController } from './controllers/customer-account.controller';
import { CustomerController } from './controllers/customer.controller';
import { CustomerFormatter } from './providers/formatters/customer.formatter';
import { CustomerService } from './providers/services/customer.service';
import { AuthModule } from '../auth';
import { JwtAccessStrategy } from './providers/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './providers/strategies/jwt-refresh.strategy';
import { CustomerJwtAccessGuard } from './providers/guards/customer-jwt-access-guard.service';
import { CustomerJwtRefreshGuard } from './providers/guards/customer-jwt-refresh-guard.service';
import { AdminModule } from '../admin';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
    ConfigModule,
    PassportModule,
    JwtModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [CustomerAccountController, CustomerController],
  providers: [
    CustomerFormatter,
    CustomerService,
    CustomerJwtAccessGuard,
    CustomerJwtRefreshGuard,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [
    CustomerFormatter,
    CustomerService,
    CustomerJwtAccessGuard,
    CustomerJwtRefreshGuard,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class CustomerModule {}
