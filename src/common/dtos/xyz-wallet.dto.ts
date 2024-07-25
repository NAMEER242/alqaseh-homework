import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty()
  orderId: number;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;
}

export class ResponseTransactionDto {
  @ApiProperty()
  transactionId: number;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;
}

export class RefundTransactionDto {
  @ApiProperty()
  transactionId: number;

  @ApiProperty()
  orderId: number;
}

export class VerifyTransactionDto {
  @ApiProperty()
  orderId: number;

  @ApiProperty()
  transactionId: number;
}
