import { Injectable } from '@nestjs/common';
import {
  CreateCreditCardDto,
  CreatePaymentDto,
  RefundPaymentDto,
} from '@qaseh/dtos';

@Injectable()
export class CreditCardService {
  private creditCards: CreateCreditCardDto[] = [];
  private transactions: any[] = [];

  create(createCreditCardDto: CreateCreditCardDto) {
    this.creditCards.push(createCreditCardDto);
    return 'Credit card added successfully';
  }

  findAll() {
    return this.creditCards;
  }

  findOne(id: number) {
    return this.creditCards[id];
  }

  remove(id: number) {
    this.creditCards.splice(id, 1);
    return 'Credit card removed successfully';
  }

  processPayment(createPaymentDto: CreatePaymentDto) {
    const transaction = {
      id: this.transactions.length + 1,
      ...createPaymentDto,
      status: 'success',
      date: new Date().toISOString(),
    };
    this.transactions.push(transaction);

    // Simulate redirection by returning the redirect URL
    return {
      transaction,
      redirectUrl: `${createPaymentDto.redirectUrl}?status=${transaction.status}&transactionId=${transaction.id}`,
    };
  }

  getTransactions() {
    return this.transactions;
  }

  refundPayment(refundPaymentDto: RefundPaymentDto) {
    const transaction = this.transactions.find(
      (t) => t.id === +refundPaymentDto.transactionId,
    );
    if (transaction) {
      transaction.status = 'refunded';
      return transaction;
    }
    return 'Transaction not found';
  }
}
