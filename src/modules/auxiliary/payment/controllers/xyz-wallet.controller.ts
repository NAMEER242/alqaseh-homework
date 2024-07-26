import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { XyzWalletService } from '../providers/services/xyz-wallet.service';
import {
  CreateTransactionDto,
  RefundTransactionDto,
  VerifyTransactionDto,
} from '@qaseh/dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerJwtAccessGuard } from '../../customer/providers/guards/customer-jwt-access-guard.service';
import { OrderService } from '../../order';
import { CustomerEntity, UserEntity } from '@qaseh/entities';
import { CustomerService } from '../../customer/providers/services/customer.service';
import { PaymentMethod } from '@qaseh/enums';
import { getFinalOrderPrice } from '@qaseh/utils';
import { ProductService } from '../../product';

@ApiTags('Payment - XYZWallet [FAKE]')
@Controller('xyz-wallet')
export class XyzWalletController {
  constructor(
    private readonly xyzWalletService: XyzWalletService,
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  @Post('transaction')
  @UseGuards(CustomerJwtAccessGuard)
  @ApiBearerAuth('Access')
  async createTransaction(
    @Req() req: any,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const user: UserEntity = req.user;
    const customer: CustomerEntity =
      await this.customerService.getCustomerByUserId(user.id);
    const order = await this.orderService.get(createTransactionDto.orderId);

    if (!order || order.customer.id != customer.id) {
      throw new NotFoundException('Order Not Found');
    }
    if (order.paymentMethod != PaymentMethod.XyzWallet) {
      throw new BadRequestException('Payment Method Not Match');
    }

    return this.xyzWalletService.createTransaction(
      createTransactionDto,
      getFinalOrderPrice(order),
    );
  }

  @Patch('verify_transaction')
  async verifyTransaction(@Body() verifyTransactionDto: VerifyTransactionDto) {
    const transaction =
      this.xyzWalletService.verifyTransactions(verifyTransactionDto);
    if (transaction.status != 'Done') {
      throw new BadRequestException('Verification Field');
    }

    let order = await this.orderService.get(verifyTransactionDto.orderId);
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
  async refundTransaction(
    @Req() req: any,
    @Body() refundTransactionDto: RefundTransactionDto,
  ) {
    const user: UserEntity = req.user;
    const customer: CustomerEntity =
      await this.customerService.getCustomerByUserId(user.id);
    const order = await this.orderService.get(refundTransactionDto.orderId);
    if (!order || order.customer.id != customer.id) {
      throw new NotFoundException('Order Not Found');
    }
    return this.xyzWalletService.refundTransaction(refundTransactionDto);
  }
}
