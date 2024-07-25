import { Injectable } from '@nestjs/common';
import {
  CreateTransactionDto,
  RefundTransactionDto,
  ResponseTransactionDto,
  VerifyTransactionDto,
} from '@qaseh/dtos';

@Injectable()
export class XyzWalletService {
  createTransaction(
    createTransactionDto: CreateTransactionDto,
    amount: number,
  ) {
    return {
      transactionId: 1,
      status: 'Pending',
      amount: amount,
      phoneNumber: createTransactionDto.phoneNumber,
      currency: createTransactionDto.currency,
    } as ResponseTransactionDto;
  }

  verifyTransactions(verifyTransactionDto: VerifyTransactionDto) {
    return {
      transactionId: verifyTransactionDto.transactionId,
      status: 'Done',
      amount: 999,
      phoneNumber: '07802421471',
      currency: 'IQD',
    } as ResponseTransactionDto;
  }

  refundTransaction(refundTransactionDto: RefundTransactionDto) {
    return {
      status: 'refunded',
    } as ResponseTransactionDto;
  }
}
