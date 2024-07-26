import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreditCardService } from '../providers/services/credit-card.service';
import {
  CreatePaymentDto,
  RefundCreditCardPaymentDto,
  VerifyCreditCardTransactionDto,
} from '@qaseh/dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerJwtAccessGuard } from '../../customer/providers/guards/customer-jwt-access-guard.service';
import { CustomerEntity, UserEntity } from '@qaseh/entities';
import { CustomerService } from '../../customer/providers/services/customer.service';
import { OrderService } from '../../order';
import { PaymentMethod } from '@qaseh/enums';
import { getFinalOrderPrice } from '@qaseh/utils';
import { ProductService } from '../../product';

@ApiTags('Payment - CreditCard')
@Controller('credit-card')
export class CreditCardController {
  constructor(
    private readonly creditCardService: CreditCardService,
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  @Post('transaction')
  @UseGuards(CustomerJwtAccessGuard)
  @ApiBearerAuth('Access')
  async processPayment(
    @Req() req: any,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    const user: UserEntity = req.user;
    const customer: CustomerEntity =
      await this.customerService.getCustomerByUserId(user.id);
    const order = await this.orderService.get(createPaymentDto.orderId);

    if (!order || order.customer.id == customer.id) {
      throw new NotFoundException('Order Not Found');
    }
    if (order.paymentMethod != PaymentMethod.CreditCard) {
      throw new BadRequestException('Payment Method Not Match');
    }

    return this.creditCardService.processPayment(
      createPaymentDto,
      getFinalOrderPrice(order),
    );
  }

  @Patch('verify_transaction')
  async verifyPayment(
    @Body() verifyPaymentDto: VerifyCreditCardTransactionDto,
  ) {
    const transaction =
      this.creditCardService.verifyTransaction(verifyPaymentDto);
    if (transaction.status != 'Done') {
      throw new BadRequestException('Verification Field');
    }

    let order = await this.orderService.get(verifyPaymentDto.orderId);
    if (!order) {
      throw new NotFoundException('Order Not Found');
    }

    order = await this.orderService.markOrderAsPaid(order);
    order.products.forEach((p) =>
      this.productService.update(p.id, p.updatedBy, { quantity: --p.quantity }),
    );
    return transaction;
  }

  @Post('refund')
  @UseGuards(CustomerJwtAccessGuard)
  @ApiBearerAuth('Access')
  async refundPayment(
    @Req() req: any,
    @Body() refundPaymentDto: RefundCreditCardPaymentDto,
  ) {
    const user: UserEntity = req.user;
    const customer: CustomerEntity =
      await this.customerService.getCustomerByUserId(user.id);
    const order = await this.orderService.get(refundPaymentDto.orderId);
    if (!order || order.customer.id == customer.id) {
      throw new NotFoundException('Order Not Found');
    }
    return this.creditCardService.refundPayment(refundPaymentDto);
  }
}
