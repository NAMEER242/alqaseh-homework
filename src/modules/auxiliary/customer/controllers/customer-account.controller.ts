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
import { CustomerFormatter } from '../providers/formatters/customer.formatter';
import {
  ChangeCustomerInfoDto,
  CreateCustomerDto,
  JwtResponseDto,
  LoginCustomerDto,
  ResponseCustomerDto,
} from '@qaseh/dtos';
import { CustomerEntity, UserEntity } from '@qaseh/entities';
import { SuccessResponseFormatter } from '@qaseh/modules/formatter';
import { AuthService } from '../../auth/providers/services/auth.service';
import { HelperService } from '../../auth';
import { CustomerJwtRefreshGuard } from '../providers/guards/customer-jwt-refresh-guard.service';
import { JoiValidatorPipe } from '@qaseh/pipes';
import {
  changeCustomerInfoValidation,
  createCustomerValidation,
} from '@qaseh/validations';
import { CustomerService } from '../providers/services/customer.service';
import { CustomerJwtAccessGuard } from '../providers/guards/customer-jwt-access-guard.service';

@ApiTags('Account Customer')
@Controller('account/customer/auth')
export class CustomerAccountController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
    private readonly helperService: HelperService,
    private readonly customerFormatter: CustomerFormatter,
    private readonly responseFormatter: SuccessResponseFormatter,
  ) {}

  @Post('register')
  @ApiOkResponse({ type: JwtResponseDto, description: 'Success' })
  @UsePipes(new JoiValidatorPipe(createCustomerValidation))
  async register(@Req() req: any, @Body() customerDto: CreateCustomerDto) {
    // Check if the user already exists.
    const isExists = await this.authService.isExists(customerDto.email);

    let jwtTokens: JwtResponseDto;

    if (isExists) {
      throw new ConflictException('Email already exists');
    }

    try {
      // Encrypt the new password
      customerDto.password = await this.helperService.makePassword(
        customerDto.password,
      );

      // create a new customer
      const customer = await this.customerService.createCustomer(customerDto);

      // Generate jwt tokens.
      jwtTokens = await this.helperService.generateJwtTokens(customer.user);
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
    description: 'Logs in an customer and returns JWT tokens.',
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
    @Body() _loginCustomerDto: LoginCustomerDto,
  ): Promise<any> {
    const user = await this.authService.getUserByEmail(_loginCustomerDto.email);

    if (
      !user ||
      !(await this.helperService.checkPassword(
        _loginCustomerDto.password,
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
    description:
      'Retrieves account information for the authenticated customer.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResponseCustomerDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(CustomerJwtAccessGuard)
  async me(@Req() req: any): Promise<any> {
    const user: UserEntity = req.user;
    const customer: CustomerEntity =
      await this.customerService.getCustomerByUserId(user.id);

    return this.responseFormatter.format({
      req: req,
      data: this.customerFormatter.formatOne(customer),
      status: HttpStatus.OK,
    });
  }

  @Patch('/change-info')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Change customer info',
    description: 'Changes customer information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResponseCustomerDto,
  })
  @ApiResponse({ status: 400, description: 'Change customer info failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @UseGuards(CustomerJwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(changeCustomerInfoValidation))
  async changeCustomerInfo(
    @Req() req: any,
    @Body() changeCustomerInfoDto: ChangeCustomerInfoDto,
  ): Promise<any> {
    // Get customer by id
    const user: UserEntity = req.user;
    let customer = await this.customerService.getCustomerByUserId(user.id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Change customer info
    customer = await this.customerService.changeCustomerInfo(
      customer,
      changeCustomerInfoDto,
    );

    if (!customer) {
      throw new BadRequestException('Change customer info failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.customerFormatter.formatOne(customer),
      status: HttpStatus.OK,
    });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Refresh')
  @ApiOperation({
    summary: 'Refresh',
    description: 'Refreshes the JWT tokens for the authenticated customer.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: JwtResponseDto })
  @ApiResponse({ status: 400, description: 'Refresh failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(CustomerJwtRefreshGuard)
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
