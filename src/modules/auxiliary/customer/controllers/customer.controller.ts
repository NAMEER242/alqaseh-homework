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
  Delete,
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
import { CustomerService } from '../providers/services/customer.service';
import { CustomerFormatter } from '../providers/formatters/customer.formatter';
import {
  ChangeCustomerInfoDto,
  ChangeCustomerPasswordDto,
  CreateCustomerDto,
  FilterCustomerDto,
  ResponseCustomerDto,
} from '@qaseh/dtos';
import { JoiValidatorPipe } from '@qaseh/pipes';
import {
  changeCustomerInfoValidation,
  createCustomerValidation,
  filterCustomerValidation,
  resetCustomerPasswordValidation,
} from '@qaseh/validations';
import { SuccessResponseFormatter } from '@qaseh/modules/formatter';
import { HelperService } from '../../auth';
import { AdminJwtAccessGuard } from '../../admin/providers/guards/admin-jwt-access-guard.service';

@ApiTags('Customers Management')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly helperService: HelperService,
    private readonly customerService: CustomerService,
    private readonly customerFormatter: CustomerFormatter,
    private readonly responseFormatter: SuccessResponseFormatter,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Create new customer',
    description:
      'Creates a new customer and sends an email verification token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResponseCustomerDto,
  })
  @ApiResponse({ status: 400, description: 'Customer creation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminJwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(createCustomerValidation))
  async createCustomer(
    @Req() req: any,
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<any> {
    // Encrypt the password
    createCustomerDto.password = await this.helperService.makePassword(
      createCustomerDto.password,
    );

    // Create a new customer
    const customer =
      await this.customerService.createCustomer(createCustomerDto);

    if (!customer) {
      throw new BadRequestException('Customer creation failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.customerFormatter.formatOne(customer),
      status: HttpStatus.CREATED,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Get all customers',
    description: 'Gets all customers based on the provided filter.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResponseCustomerDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AdminJwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(filterCustomerValidation))
  async getAllCustomers(
    @Req() req: any,
    @Query() filter: FilterCustomerDto,
  ): Promise<any> {
    const { customers, count } =
      await this.customerService.getAllCustomers(filter);

    return this.responseFormatter.format({
      req: req,
      data: this.customerFormatter.formatAll(customers),
      count: count,
      status: HttpStatus.OK,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Get customer',
    description: 'Get customer details by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResponseCustomerDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @UseGuards(AdminJwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(filterCustomerValidation))
  async getCustomer(@Req() req: any, @Param('id') id: number): Promise<any> {
    // Get customer by id
    const customer = await this.customerService.getCustomer(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.customerFormatter.formatOne(customer),
      status: HttpStatus.OK,
    });
  }

  @Patch(':id/change-info')
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
  @UseGuards(AdminJwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(changeCustomerInfoValidation))
  async changeCustomerInfo(
    @Req() req: any,
    @Body() changeCustomerInfoDto: ChangeCustomerInfoDto,
    @Param('id') id: number,
  ): Promise<any> {
    // Get customer by id
    let customer = await this.customerService.getCustomer(id);

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

  @Patch(':id/reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Reset customer password',
    description: 'Resets the password for the specified customer.',
  })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Reset customer password failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @UseGuards(AdminJwtAccessGuard)
  @UsePipes(new JoiValidatorPipe(resetCustomerPasswordValidation))
  async resetCustomerPassword(
    @Body() changePasswordDto: ChangeCustomerPasswordDto,
    @Param('id') id: number,
  ): Promise<void> {
    // Get customer by id
    const customer = await this.customerService.getCustomer(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (changePasswordDto.oldPassword !== changePasswordDto.newPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Encrypt the new password
    const password = await this.helperService.makePassword(
      changePasswordDto.newPassword,
    );

    // Reset customer password
    const result = await this.customerService.updateCustomerPassword(
      customer,
      password,
    );

    if (!result) {
      throw new BadRequestException('Reset customer password failed');
    }
  }

  @Delete(':id/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('Access')
  @ApiOperation({
    summary: 'Soft delete customer',
    description: 'Soft deletes the specified customer.',
  })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Delete customer failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @UseGuards(AdminJwtAccessGuard)
  async deleteCustomer(@Param('id') id: number): Promise<void> {
    // Get customer by id
    const customer = await this.customerService.getCustomer(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Soft delete customer
    const result = this.customerService.DeleteCustomer(id);

    if (!result) {
      throw new BadRequestException('Delete customer failed');
    }
  }
}
