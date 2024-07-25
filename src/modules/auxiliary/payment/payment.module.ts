import { Module } from '@nestjs/common';
import { CreditCardController } from './controllers/credit-card.controller';
import { CreditCardService } from './providers/services/credit-card.service';
import { XyzWalletController } from './controllers/xyz-wallet.controller';
import { XyzWalletService } from './providers/services/xyz-wallet.service';
import { OrderModule } from '../order';
import { CustomerModule } from '../customer';

@Module({
  imports: [OrderModule, CustomerModule],
  controllers: [CreditCardController, XyzWalletController],
  providers: [CreditCardService, XyzWalletService],
})
export class PaymentModule {}
