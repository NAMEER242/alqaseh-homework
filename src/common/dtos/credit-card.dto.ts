import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  orderId: number;

  @ApiProperty()
  cardNumber: string;

  @ApiProperty()
  cardholder: string;

  @ApiProperty()
  expiration: string;

  @ApiProperty()
  cvv: string;

  @ApiProperty()
  currency: string;
}

export class ResponseCreditCardTransactionDto {
  @ApiProperty()
  transactionId: number;

  @ApiProperty()
  cardNumber: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  status: string;
}

export class RefundCreditCardPaymentDto {
  @ApiProperty()
  transactionId: number;

  @ApiProperty()
  orderId: number;
}

export class VerifyCreditCardTransactionDto {
  @ApiProperty()
  orderId: number;

  @ApiProperty()
  transactionId: number;
}
