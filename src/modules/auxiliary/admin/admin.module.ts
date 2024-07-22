import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '@qaseh/entities';
import { ConfigModule, SuperuserConfigService } from '@qaseh/modules/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AdminAccountController } from './controllers/admin-account.controller';
import { AdminController } from './controllers/admin.controller';
import { AdminFormatter } from './providers/formatters/admin.formatter';
import { AdminService } from './providers/services/admin.service';
import { AuthModule, HelperService } from '../auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    ConfigModule,
    PassportModule,
    JwtModule,
    AuthModule,
  ],
  controllers: [AdminAccountController, AdminController],
  providers: [AdminFormatter, AdminService],
  exports: [AdminFormatter, AdminService],
})
export class AdminModule implements OnModuleInit {
  constructor(
    private readonly superuserConfigService: SuperuserConfigService,
    private readonly adminService: AdminService,
    private readonly helperService: HelperService,
  ) {}

  /**
   * initializing the default superuser account using the information
   * defined in the environment variables if they exist else use the
   * default data.
   */
  async onModuleInit() {
    const email =
      this.superuserConfigService.superuserEmail ?? 'superuser@gmail.com';
    const password = await this.helperService.makePassword(
      this.superuserConfigService.superuserPassword ?? 'superuser',
    );
    const isSuperuserExists = await this.adminService.getSuperuser();
    if (!isSuperuserExists) {
      await this.adminService.createAdmin({
        email: email,
        password: password,
        fullName: 'superuser',
        isSuperuser: true,
      });
    }
  }
}
