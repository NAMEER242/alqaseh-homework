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
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  OrderFilterDto,
  OrderResponseDto,
  UpdateAdminOrderDto,
  UpdateOrderDto,
} from '@qaseh/dtos';
import { OrderService } from '../providers/services/order.service';
import { JoiValidatorPipe } from '@qaseh/pipes';
import {
  orderFilterValidation,
  orderUpdateValidation,
} from '@qaseh/validations';
import { AdminJwtAccessGuard } from '../../admin/providers/guards/admin-jwt-access-guard.service';
import { OrderFormatter } from '../providers/formatters/order.formatter';
import { SuccessResponseFormatter } from '@qaseh/modules/formatter';
import { ProductService } from '../../product';
import { DiscountService } from '../../discount';

@ApiTags('Order Management')
@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly discountService: DiscountService,
    private readonly orderFormatter: OrderFormatter,
    private readonly responseFormatter: SuccessResponseFormatter,
  ) {}

  @Get('orders')
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(orderFilterValidation))
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderResponseDto,
    isArray: true,
  })
  async getAll(@Req() req: any, @Query() filterDto: OrderFilterDto) {
    const { orders, count } = await this.orderService.getAll(filterDto);

    if (!orders) {
      throw new BadRequestException('Failed to get all orders');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.orderFormatter.formatAll(orders),
      count: count,
      status: HttpStatus.OK,
    });
  }

  @Get('orders/:id')
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderResponseDto,
  })
  async get(@Req() req: any, @Param('id') id: number) {
    const order = await this.orderService.get(id);

    if (!order) {
      throw new BadRequestException('Failed to get the order');
    }

    return this.responseFormatter.format({
      req: req,
      data: this.orderFormatter.formatOne(order),
      status: HttpStatus.OK,
    });
  }

  @Patch('orders/:id')
  @UseGuards(AdminJwtAccessGuard)
  @ApiBearerAuth('Access')
  @UsePipes(new JoiValidatorPipe(orderUpdateValidation))
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderResponseDto,
  })
  @ApiOperation({
    description: 'Available payment methods are: [credit, xyzWallet]',
  })
  async update(
    @Req() req: any,
    @Param('id') id: number,
    @Body() orderDto: UpdateAdminOrderDto,
  ) {
    const products = await this.productService.getByIds(
      orderDto.productIds ?? [],
    );
    const updateDto = {
      orderPrice: products.reduce((total, product) => total + product.price, 0),
      ...orderDto,
    } as UpdateOrderDto;

    const order = await this.orderService.adminUpdate(
      id,
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

  @Delete('orders/:id')
  @UseGuards(AdminJwtAccessGuard)
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
