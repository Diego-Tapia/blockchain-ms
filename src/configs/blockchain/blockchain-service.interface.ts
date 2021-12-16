import { Wallet } from 'src/features/wallet/domain/entities/wallet.entity';

export interface IBlockchainService {
  createWallet(): Promise<Wallet>;

  createToken(
    bcItemId: number,
    amount: number,
    wallet: Wallet): Promise<string>;

  sendTransaction(
    walletFrom: string,
    walletTo: string,
    tokenId: number,
    amount: number): Promise<string>;
}
