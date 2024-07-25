import { Module } from '@nestjs/common';
import { CreditCardController } from './controllers/credit-card.controller';
import { CreditCardService } from './providers/services/credit-card.service';

@Module({
  imports: [],
  controllers: [CreditCardController],
  providers: [CreditCardService],
})
export class PaymentModule {}
