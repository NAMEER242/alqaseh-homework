import { ApiProperty } from '@nestjs/swagger';

export class CreateCreditCardDto {
  @ApiProperty()
  number: string;

  @ApiProperty()
  cardholder: string;

  @ApiProperty()
  expiration: string;

  @ApiProperty()
  cvv: string;
}

export class CreatePaymentDto {
  @ApiProperty()
  cardNumber: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  redirectUrl: string; // Add this field
}

export class RefundPaymentDto {
  @ApiProperty()
  transactionId: string;

  @ApiProperty()
  amount: number;
}
