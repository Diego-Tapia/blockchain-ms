import { Wallet } from '../../domain/entities/wallet.entity';

export interface ICreateWalletApplication {
  execute(): Promise<Wallet>;
}
