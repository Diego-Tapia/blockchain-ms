import { Wallet } from '../../domain/entities/wallet.entity';

export interface IGetWalletByIdApplication {
  execute(id: string): Promise<Wallet>;
}
