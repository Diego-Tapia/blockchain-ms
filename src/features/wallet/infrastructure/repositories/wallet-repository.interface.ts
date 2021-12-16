import { FilterQuery } from 'mongoose';
import { WalletModel } from 'src/shared/infrastructure/models/wallet.model';
import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';
import { Balance } from '../../domain/entities/balance.entity';
import { Wallet } from '../../domain/entities/wallet.entity';

export interface IWalletRepository {
  create(wallet: Wallet): Promise<Wallet>;
  findAll(): Promise<Wallet[]>;
  findById(id: string): Promise<Wallet>;
  addBalance(walletId: string, balance: Balance, session: IClientSession): Promise<void>;
  updateBalance(walletId: string, tokenId: string, amount: number, session?: IClientSession): Promise<void>;
  findWallet(filter: FilterQuery<WalletModel>): Promise<Wallet>;
}
