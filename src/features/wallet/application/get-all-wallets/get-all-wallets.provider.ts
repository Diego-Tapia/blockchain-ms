import { WalletTypes } from '../../wallet.types';
import { GetAllWalletsApplication } from './get-all-wallets.application';

export const GetAllWalletsApplicationProvider = {
  provide: WalletTypes.APPLICATION.GET_ALL_WALLETS,
  useClass: GetAllWalletsApplication,
};
