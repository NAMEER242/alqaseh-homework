import { Injectable } from '@nestjs/common';
import {
  CreatePaymentDto,
  RefundCreditCardPaymentDto,
  ResponseCreditCardTransactionDto,
  VerifyCreditCardTransactionDto,
} from '@qaseh/dtos';

@Injectable()
export class CreditCardService {
  processPayment(createPaymentDto: CreatePaymentDto, amount: number) {
    return {
      cardNumber: createPaymentDto.cardNumber,
      currency: createPaymentDto.currency,
      amount: amount,
      transactionId: 1,
      status: 'Pending',
    } as ResponseCreditCardTransactionDto;
  }

  verifyTransaction(
    verifyCreditCardTransactionDto: VerifyCreditCardTransactionDto,
  ) {
    return {
      cardNumber: '999',
      currency: 'IQD',
      amount: 999,
      transactionId: verifyCreditCardTransactionDto.transactionId,
      status: 'Done',
    } as ResponseCreditCardTransactionDto;
  }

  refundPayment(refundPaymentDto: RefundCreditCardPaymentDto) {
    return {
      cardNumber: '999',
      currency: 'IQD',
      amount: 999,
      transactionId: refundPaymentDto.transactionId,
      status: 'Refunded',
    } as ResponseCreditCardTransactionDto;
  }
}
