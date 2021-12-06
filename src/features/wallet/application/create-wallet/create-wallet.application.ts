import { Injectable, Inject } from '@nestjs/common';
import { IBlockchainService } from 'src/configs/blockchain/blockchain-service.interface';
import { ConfigTypes } from 'src/configs/configs.types';
import { Wallet } from '../../domain/entities/wallet.entity';
import { IWalletRepository } from '../../infrastructure/repositories/wallet-repository.interface';
import { WalletTypes } from '../../wallet.types';
import { ICreateWalletApplication } from './create-wallet-app.interface';

@Injectable()
export class CreateWalletApplication implements ICreateWalletApplication {
  constructor(
    @Inject(WalletTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletRepository: IWalletRepository,
    @Inject(ConfigTypes.BLOCKCHAIN.SERVICE)
    private readonly blockchainService: IBlockchainService,
  ) { }

  public async execute(): Promise<Wallet> {
    return this.blockchainService
      .createWallet()
      .then((wallet) => this.walletRepository.create(wallet))
      .catch((e) => {
        console.log('wallet creation error', e)
        throw new Error('wallet creation error')
      });
  }
}
