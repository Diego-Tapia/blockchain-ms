import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Wallet } from '../../domain/entities/wallet.entity';
import { IWalletRepository } from '../../infrastructure/repositories/wallet-repository.interface';
import { WalletTypes } from '../../wallet.types';
import { IGetWalletByIdApplication } from './get-wallet-by-id-app.interface';

@Injectable()
export class GetWalletByIdApplication implements IGetWalletByIdApplication {
  constructor(
    @Inject(WalletTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly walletRepository: IWalletRepository,
  ) { }

  public async execute(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) throw new NotFoundException("Wallet no encontrada.");
    return wallet;
  }
}
