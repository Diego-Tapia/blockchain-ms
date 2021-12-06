import { WalletTypes } from '../../wallet.types';
import { WalletRepository } from './wallet.repository';

export const WalletRepositoryProvider = {
  provide: WalletTypes.INFRASTRUCTURE.REPOSITORY,
  useClass: WalletRepository,
};
