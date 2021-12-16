import { forwardRef, Module } from '@nestjs/common';
import { TransactionController } from 'src/api/transaction/transaction.controller';
import { BlockchainServiceProvider } from 'src/configs/blockchain/blockchain.provider';
import { TokenFeatureModule } from '../token/token.module';
import { UserFeatureModule } from '../user_profile/user.module';
import { WalletFeatureModule } from '../wallet/wallet.module';
import { IndividualIncreaseApplicationProvider } from './application/individual-increase/individual-increase.provider';
import { TransactionRepositoryProvider } from './infrastructure/repositories/transaction/transaction-repository.provider';
import { TransactionQueueListenerApplicationProvider } from './application/transaction-queue-listener/transaction-queue-listener.provider';
import { MassiveDecreaseApplicationProvider } from './application/massive-decrease/massive-decrease.provider';
import { MassiveDecreaseRepositoryProvider } from './infrastructure/repositories/massive-decrease/massive-decrease-repository.provider';
import { MassiveIncreaseApplicationProvider } from './application/massive-increase/massive-increase.provider';
import { MassiveIncreaseRepositoryProvider } from './infrastructure/repositories/massive-increase/massive-increase-repository.provider';
import { TransferApplicationProvider } from './application/transfer/transfer.provider';
import { IndividualDecreaseApplicationProvider } from './application/individual-decrease/individual-decrease.provider';
import { WalletsByClientsFeatureModule } from '../wallestByClients/walletsByClients.module';

@Module({
  controllers: [TransactionController],
  imports: [UserFeatureModule, WalletFeatureModule, forwardRef(() => TokenFeatureModule), WalletsByClientsFeatureModule],
  providers: [
    TransactionRepositoryProvider,
    BlockchainServiceProvider,
    IndividualIncreaseApplicationProvider,
    IndividualDecreaseApplicationProvider,
    TransactionQueueListenerApplicationProvider,
    MassiveDecreaseApplicationProvider,
    MassiveDecreaseRepositoryProvider,
    MassiveIncreaseApplicationProvider,
    MassiveIncreaseRepositoryProvider,
    TransferApplicationProvider
  ],
  exports: [TransactionRepositoryProvider]
})
export class TransactionFeatureModule { }
