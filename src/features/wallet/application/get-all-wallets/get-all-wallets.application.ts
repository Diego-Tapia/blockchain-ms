import { Injectable, Inject } from '@nestjs/common';
import { IBlockchainService } from 'src/configs/blockchain/blockchain-service.interface';
import { ConfigTypes } from 'src/configs/configs.types';
import { Wallet } from '../../domain/entities/wallet.entity';
import { IWalletRepository } from '../../infrastructure/repositories/wallet-repository.interface';
import { WalletTypes } from '../../wallet.types';
import { IGetAllWalletsApplication } from './get-all-wallets-app.interface';

@Injectable()
export class GetAllWalletsApplication implements IGetAllWalletsApplication {
  constructor(
    @Inject(WalletTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletRepository: IWalletRepository,
    @Inject(ConfigTypes.BLOCKCHAIN.SERVICE) private readonly blockchainService: IBlockchainService,
  ) {}

  public execute(): Promise<Wallet[]> {
    return this.walletRepository.findAll();
  }
}
