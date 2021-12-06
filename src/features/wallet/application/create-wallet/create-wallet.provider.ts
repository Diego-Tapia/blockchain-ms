import { WalletTypes } from '../../wallet.types';
import { CreateWalletApplication } from './create-wallet.application';

export const CreateWalletApplicationProvider = {
  provide: WalletTypes.APPLICATION.CREATE_WALLET,
  useClass: CreateWalletApplication,
};
