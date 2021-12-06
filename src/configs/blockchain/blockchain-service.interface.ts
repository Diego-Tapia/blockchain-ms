import { Wallet } from 'src/features/wallet/domain/entities/wallet.entity';

export interface IBlockchainService {
  createWallet(): Promise<Wallet>;
  createToken(bcItemId: number, amount: number, wallet: Wallet): Promise<string>;
}
