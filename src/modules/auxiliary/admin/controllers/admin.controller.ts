import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AdminService } from '../providers/services/admin.service';
import { AdminFormatter } from '../providers/formatters/admin.formatter';
import {
  ChangeAdminInfoDto,
  ChangeAdminPasswordDto,
  CreateAdminDto,
  FilterAdminDto,
  ResponseAdminDto,
} from '@qaseh/dtos';
import { JoiValidatorPipe } from '@qaseh/pipes';
import {
  changeAdminInfoValidation,
  createAdminValidation,
  filterAdminValidation,
  resetAdminPasswordValidation,
} from '@qaseh/validations';
import { SuccessResponseFormatter } from '@qaseh/modules/formatter';
import { HelperService, JwtAccessGuard } from '../../auth';

@ApiTags('Admins Management')
@Controller('admins')
export class AdminController {
  constructor(
    private readonly helperService: HelperService,
    private readonly adminService: AdminService,
    private readonly adminFormatter: AdminFormatter,
    private readonly responseFormatter: SuccessResponseFormatter,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Create new admin',
    description: 'Creates a new admin and sends an email verification token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResponseAdminDto,
  })
  @ApiResponse({ status: 400, description: 'Admin creation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(createAdminValidation))
  async createAdmin(
    @Req() req: any,
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<any> {
    // Encrypt the password
    createAdminDto.password = await this.helperService.makePassword(
      createAdminDto.password,
    );

    // Create a new admin
    const admin = await this.adminService.createAdmin(createAdminDto);

    if (!admin) {
      throw new BadRequestException('Admin creation failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.adminFormatter.formatOne(admin),
      status: HttpStatus.CREATED,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Get all admins',
    description: 'Gets all admins based on the provided filter.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResponseAdminDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(filterAdminValidation))
  async getAllAdmins(
    @Req() req: any,
    @Query() filter: FilterAdminDto,
  ): Promise<any> {
    const { admins, count } = await this.adminService.getAllAdmins(filter);

    return this.responseFormatter.format({
      req: req,
      data: this.adminFormatter.formatAll(admins),
      count: count,
      status: HttpStatus.OK,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Get admin',
    description: 'Get admin details by ID.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: ResponseAdminDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @UseGuards(JwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(filterAdminValidation))
  async getAdmin(@Req() req: any, @Param('id') id: number): Promise<any> {
    // Get admin by id
    const admin = await this.adminService.getAdmin(id);

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.adminFormatter.formatOne(admin),
      status: HttpStatus.OK,
    });
  }

  @Patch(':id/change-info')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Change admin info',
    description: 'Changes admin information.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: ResponseAdminDto })
  @ApiResponse({ status: 400, description: 'Change admin info failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @UseGuards(JwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(changeAdminInfoValidation))
  async changeAdminInfo(
    @Req() req: any,
    @Body() changeAdminInfoDto: ChangeAdminInfoDto,
    @Param('id') id: number,
  ): Promise<any> {
    // Get admin by id
    let admin = await this.adminService.getAdmin(id);

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Change admin info
    admin = await this.adminService.changeAdminInfo(admin, changeAdminInfoDto);

    if (!admin) {
      throw new BadRequestException('Change admin info failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.adminFormatter.formatOne(admin),
      status: HttpStatus.OK,
    });
  }

  @Patch(':id/reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Reset admin password',
    description: 'Resets the password for the specified admin.',
  })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Reset admin password failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @UseGuards(JwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(resetAdminPasswordValidation))
  async resetAdminPassword(
    @Body() changePasswordDto: ChangeAdminPasswordDto,
    @Param('id') id: number,
  ): Promise<void> {
    // Get admin by id
    const admin = await this.adminService.getAdmin(id);

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (changePasswordDto.oldPassword !== changePasswordDto.newPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Encrypt the new password
    const password = await this.helperService.makePassword(
      changePasswordDto.newPassword,
    );

    // Reset admin password
    const result = await this.adminService.updateAdminPassword(admin, password);

    if (!result) {
      throw new BadRequestException('Reset admin password failed');
    }
  }

  @Patch(':id/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Soft delete admin',
    description: 'Soft deletes the specified admin.',
  })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Delete admin failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @UseGuards(JwtAccessGuard)
  async deleteAdmin(@Param('id') id: number): Promise<void> {
    // Get admin by id
    const admin = await this.adminService.getAdmin(id);

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Soft delete admin
    const result = this.adminService.DeleteAdmin(id);

    if (!result) {
      throw new BadRequestException('Delete admin failed');
    }
  }
}
