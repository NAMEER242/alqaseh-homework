import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CreditCardService } from '../providers/services/credit-card.service';
import {
  CreateCreditCardDto,
  CreatePaymentDto,
  RefundPaymentDto,
} from '@qaseh/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment - CreditCard')
@Controller('credit-card')
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Post()
  create(@Body() createCreditCardDto: CreateCreditCardDto) {
    return this.creditCardService.create(createCreditCardDto);
  }

  @Get()
  findAll() {
    return this.creditCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditCardService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditCardService.remove(+id);
  }

  @Post('payment')
  processPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.creditCardService.processPayment(createPaymentDto);
  }

  @Get('transactions')
  getTransactions() {
    return this.creditCardService.getTransactions();
  }

  @Post('refund')
  refundPayment(@Body() refundPaymentDto: RefundPaymentDto) {
    return this.creditCardService.refundPayment(refundPaymentDto);
  }
}
