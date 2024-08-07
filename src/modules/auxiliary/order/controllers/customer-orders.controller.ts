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
import {
  CreateCustomerOrderDto,
  CreateOrderDto,
  CustomerOrderFilterDto,
  OrderFilterDto,
  OrderResponseDto,
  UpdateCustomerOrderDto,
  UpdateOrderDto,
} from '@qaseh/dtos';
import { OrderService } from '../providers/services/order.service';
import { JoiValidatorPipe } from '@qaseh/pipes';
import {
  customerOrderCreateValidation,
  customerOrderUpdateValidation,
  orderFilterValidation,
} from '@qaseh/validations';
import { OrderFormatter } from '../providers/formatters/order.formatter';
import { SuccessResponseFormatter } from '@qaseh/modules/formatter';
import { UserEntity } from '@qaseh/entities';
import { CustomerService } from '../../customer/providers/services/customer.service';
import { ProductService } from '../../product';
import { CustomerJwtAccessGuard } from '../../customer/providers/guards/customer-jwt-access-guard.service';
import { DiscountService } from '../../discount';

@ApiTags('Orders')
@Controller()
export class CustomerOrdersController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly discountService: DiscountService,
    private readonly customerService: CustomerService,
    private readonly orderFormatter: OrderFormatter,
    private readonly responseFormatter: SuccessResponseFormatter,
  ) {}

  @Get('customer/orders')
  @UseGuards(CustomerJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(orderFilterValidation))
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderResponseDto,
    isArray: true,
  })
  async getAllCustomerOrders(
    @Req() req: any,
    @Query() filterDto: CustomerOrderFilterDto,
  ) {
    const user: UserEntity = req.user;
    const customer = await this.customerService.getAdminByUserId(user.id);
    const { orders, count } = await this.orderService.getAllCustomerOrders(
      customer.id,
      filterDto as OrderFilterDto,
    );

    if (!orders) {
      throw new BadRequestException('Failed to get all customer orders');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.orderFormatter.formatAll(orders),
      count: count,
      status: HttpStatus.OK,
    });
  }

  @Get('customer/orders/:id')
  @UseGuards(CustomerJwtAccessGuard)
  @ApiBearerAuth('Access')
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderResponseDto,
  })
  async getCustomerOrder(@Req() req: any, @Param('id') id: number) {
    const user: UserEntity = req.user;
    const customer = await this.customerService.getAdminByUserId(user.id);
    const order = await this.orderService.get(id);

    if (!order || order.customer.id != customer.id) {
      throw new BadRequestException('Failed to get the order');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.orderFormatter.formatOne(order),
      status: HttpStatus.OK,
    });
  }

  @Post('customer/orders')
  @UseGuards(CustomerJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(customerOrderCreateValidation))
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OrderResponseDto,
  })
  @ApiOperation({
    description: 'Available payment methods are: [credit, xyzWallet]',
  })
  async createCustomerOrder(
    @Req() req: any,
    @Body() orderDto: CreateCustomerOrderDto,
  ) {
    const user: UserEntity = req.user;
    const customer = await this.customerService.getAdminByUserId(user.id);
    const products = await this.productService.getByIds(
      orderDto.productIds ?? [],
    );
    const isEachProductsValid =
      await this.orderService.validateOrderProducts(products);
    if (!isEachProductsValid) {
      throw new BadRequestException('One or more products are out of stock');
    }

    const createDto = {
      orderPrice: products.reduce((total, product) => total + product.price, 0),
      ...orderDto,
    } as CreateOrderDto;

    const order = await this.orderService.create(customer, products, createDto);

    if (!order) {
      throw new BadRequestException('Order creation failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.orderFormatter.formatOne(order),
      status: HttpStatus.CREATED,
    });
  }

  @Patch('customer/orders/:id')
  @UseGuards(CustomerJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(customerOrderUpdateValidation))
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderResponseDto,
  })
  @ApiOperation({
    description: 'Available payment methods are: [credit, xyzWallet]',
  })
  async updateCustomerOrder(
    @Req() req: any,
    @Param('id') id: number,
    @Body() orderDto: UpdateCustomerOrderDto,
  ) {
    const user: UserEntity = req.user;
    const customer = await this.customerService.getAdminByUserId(user.id);
    const products = await this.productService.getByIds(
      orderDto.productIds ?? [],
    );
    const updateDto = {
      orderPrice: products.reduce((total, product) => total + product.price, 0),
      ...orderDto,
    } as UpdateOrderDto;

    const order = await this.orderService.update(
      id,
      customer,
      orderDto.productIds != undefined ? products : undefined,
      updateDto,
    );

    if (!order) {
      throw new BadRequestException('Order Update failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.orderFormatter.formatOne(order),
      status: HttpStatus.OK,
    });
  }

  @Patch('customer/orders/:id/discount/:code')
  @UseGuards(CustomerJwtAccessGuard)
  @ApiBearerAuth('Access')
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderResponseDto,
  })
  async setDiscount(
    @Req() req: any,
    @Param('id') id: number,
    @Param('code') discountCode: string,
  ) {
    let order = await this.orderService.get(id);
    if (!order) {
      throw new NotFoundException('Order Not Fount');
    }

    let discount = await this.discountService.validateDiscountByCode(
      discountCode,
      order,
    );
    if (!discount) {
      throw new BadRequestException('Discount Code Not Valid');
    }

    discount = await this.discountService.update(discount.id, { isUsed: true });
    order = await this.orderService.setDiscount(order, discount);

    if (!order) {
      throw new BadRequestException('Order Update Failed');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.orderFormatter.formatOne(order),
      status: HttpStatus.OK,
    });
  }

  @Delete('customer/orders/:id')
  @UseGuards(CustomerJwtAccessGuard)
  @ApiBearerAuth('Access')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async delete(@Req() req: any, @Param('id') id: number) {
    const result = this.orderService.delete(id);

    if (!result) {
      throw new NotFoundException('Order not found');
    }

    return this.responseFormatter.format({
      req: req,
      status: HttpStatus.NO_CONTENT,
    });
  }
}
