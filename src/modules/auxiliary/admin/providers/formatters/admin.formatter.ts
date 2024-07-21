import { Injectable } from '@nestjs/common';
import { BaseFormatter } from '@qaseh/modules/formatter';
import { AdminEntity } from '@qaseh/entities';
import { ResponseAdminDto } from '@qaseh/dtos';

@Injectable()
export class AdminFormatter extends BaseFormatter<
  AdminEntity,
  ResponseAdminDto
> {
  constructor() {
    super((admin: AdminEntity): ResponseAdminDto => {
      return {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.user.email,
        imageUrl: admin.imageUrl,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      };
    });
  }
}
