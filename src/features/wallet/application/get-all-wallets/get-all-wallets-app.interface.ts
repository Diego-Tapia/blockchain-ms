import { Wallet } from '../../domain/entities/wallet.entity';

export interface IGetAllWalletsApplication {
  execute(): Promise<Wallet[]>;
}
