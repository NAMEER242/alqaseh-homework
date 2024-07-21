import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '@qaseh/entities';
import { ConfigModule } from '@qaseh/modules/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AdminAccountController } from './controllers/admin-account.controller';
import { AdminController } from './controllers/admin.controller';
import { AdminFormatter } from './providers/formatters/admin.formatter';
import { HelperService } from './providers/services/helper.service';
import { AdminService } from './providers/services/admin.service';
import { AuthModule } from '../auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    ConfigModule,
    PassportModule,
    JwtModule,
    AuthModule,
  ],
  controllers: [AdminAccountController, AdminController],
  providers: [AdminFormatter, HelperService, AdminService],
  exports: [AdminFormatter, HelperService, AdminService],
})
export class AdminModule {}
