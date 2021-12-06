import { Module } from '@nestjs/common';
import { WalletController } from 'src/api/wallet/wallet.controller';
import { BlockchainServiceProvider } from 'src/configs/blockchain/blockchain.provider';
import { CreateWalletApplicationProvider } from './application/create-wallet/create-wallet.provider';
import { GetAllWalletsApplicationProvider } from './application/get-all-wallets/get-all-wallets.provider';
import { GetWalletByIdApplicationProvider } from './application/get-wallet-by-id/get-wallet-by-id.provider';
import { WalletRepositoryProvider } from './infrastructure/repositories/wallet-repository.provider';

@Module({
  controllers: [WalletController],
  imports: [],
  providers: [
    WalletRepositoryProvider,
    CreateWalletApplicationProvider,
    GetAllWalletsApplicationProvider,
    GetWalletByIdApplicationProvider,
    BlockchainServiceProvider,
  ],
  exports: [WalletRepositoryProvider]
})
export class WalletFeatureModule { }
