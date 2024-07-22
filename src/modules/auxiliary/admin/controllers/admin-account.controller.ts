import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AdminFormatter } from '../providers/formatters/admin.formatter';
import {
  ChangeAdminInfoDto,
  CreateAdminDto,
  JwtResponseDto,
  LoginAdminDto,
  ResponseAdminDto,
} from '@qaseh/dtos';
import { AdminEntity, UserEntity } from '@qaseh/entities';
import { SuccessResponseFormatter } from '@qaseh/modules/formatter';
import { AuthService } from '../../auth/providers/services/auth.service';
import { HelperService } from '../../auth';
import { AdminJwtRefreshGuard } from '../providers/guards/admin-jwt-refresh-guard.service';
import { JoiValidatorPipe } from '@qaseh/pipes';
import {
  changeAdminInfoValidation,
  createUserValidation,
} from '@qaseh/validations';
import { AdminService } from '../providers/services/admin.service';
import { AdminJwtAccessGuard } from '../providers/guards/admin-jwt-access-guard.service';

@ApiTags('Account Admin')
@Controller('account/admin/auth')
export class AdminAccountController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
    private readonly helperService: HelperService,
    private readonly adminFormatter: AdminFormatter,
    private readonly responseFormatter: SuccessResponseFormatter,
  ) {}

  @Post('register')
  @ApiOkResponse({ type: JwtResponseDto, description: 'Success' })
  @UsePipes(new JoiValidatorPipe(createUserValidation))
  async register(@Req() req: any, @Body() adminDto: CreateAdminDto) {
    // Check if the user already exists.
    const isExists = await this.authService.isExists(adminDto.email);

    let jwtTokens: JwtResponseDto;

    if (isExists) {
      throw new ConflictException('Email already exists');
    }

    try {
      // Encrypt the new password
      adminDto.password = await this.helperService.makePassword(
        adminDto.password,
      );

      // create a new admin
      const admin = await this.adminService.createAdmin(adminDto);

      // Generate jwt tokens.
      jwtTokens = await this.helperService.generateJwtTokens(admin.user);
    } catch {
      throw new BadRequestException('Registration failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: jwtTokens,
      status: HttpStatus.OK,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login',
    description: 'Logs in an admin and returns JWT tokens.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: JwtResponseDto })
  @ApiResponse({
    status: 400,
    description: `
    - Incorrect email or password 
    - Login failed
    `,
  })
  async login(
    @Req() req: any,
    @Body() _loginAdminDto: LoginAdminDto,
  ): Promise<any> {
    const user = await this.authService.getUserByEmail(_loginAdminDto.email);

    if (
      !user ||
      !(await this.helperService.checkPassword(
        _loginAdminDto.password,
        user.password,
      ))
    ) {
      throw new BadRequestException('Incorrect email or password');
    }

    const jwtTokens = await this.helperService.generateJwtTokens(user);

    return this.responseFormatter.format({
      req: req,
      data: jwtTokens,
      status: HttpStatus.OK,
    });
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Get account information',
    description: 'Retrieves account information for the authenticated admin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResponseAdminDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminJwtAccessGuard)
  async me(@Req() req: any): Promise<any> {
    const user: UserEntity = req.user;
    const admin: AdminEntity = await this.adminService.getAdminByUserId(
      user.id,
    );

    return this.responseFormatter.format({
      req: req,
      data: this.adminFormatter.formatOne(admin),
      status: HttpStatus.OK,
    });
  }

  @Patch('/change-info')
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
  @UseGuards(AdminJwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(changeAdminInfoValidation))
  async changeAdminInfo(
    @Req() req: any,
    @Body() changeAdminInfoDto: ChangeAdminInfoDto,
  ): Promise<any> {
    // Get admin by id
    const user: UserEntity = req.user;
    let admin = await this.adminService.getAdminByUserId(user.id);

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

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Refresh')
  @ApiOperation({
    summary: 'Refresh',
    description: 'Refreshes the JWT tokens for the authenticated admin.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: JwtResponseDto })
  @ApiResponse({ status: 400, description: 'Refresh failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminJwtRefreshGuard)
  async refresh(@Req() req: any): Promise<any> {
    const user: UserEntity = req.user;
    const jwt = await this.helperService.generateJwtTokens(user);

    if (!jwt) {
      throw new BadRequestException('Refresh failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: jwt,
      status: HttpStatus.OK,
    });
  }
}
