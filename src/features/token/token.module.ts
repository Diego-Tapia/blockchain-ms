import { Module } from '@nestjs/common';
import { TokenController } from 'src/api/token/token.controller';
import { BlockchainServiceProvider } from 'src/configs/blockchain/blockchain.provider';
import { TransactionFeatureModule } from '../transaction/transaction.module';
import { UserFeatureModule } from '../user_profile/user.module';
import { WalletFeatureModule } from '../wallet/wallet.module';
import { CreateTokenApplicationProvider } from './application/create-token/create-token.provider';
import { EmitTokenApplicationProvider } from './application/emit-token/emit-token.provider';
import { GetAllTokensApplicationProvider } from './application/get-all-tokens/get-all-tokens.provider';
import { GetTokenByIdApplicationProvider } from './application/get-token-by-id/get-token-by-id.provider';
import { TokenRepositoryProvider } from './infrastructure/repositories/token-repository.provider';

@Module({
  controllers: [TokenController],
  imports: [
    UserFeatureModule, 
    WalletFeatureModule, 
    TransactionFeatureModule
  ],
  providers: [
    TokenRepositoryProvider,
    CreateTokenApplicationProvider,
    GetAllTokensApplicationProvider,
    GetTokenByIdApplicationProvider,
    BlockchainServiceProvider,
    EmitTokenApplicationProvider
  ],
  exports: [TokenRepositoryProvider]
})
export class TokenFeatureModule { }
