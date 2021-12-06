import { WalletTypes } from '../../wallet.types';
import { GetWalletByIdApplication } from './get-wallet-by-id.application';

export const GetWalletByIdApplicationProvider = {
  provide: WalletTypes.APPLICATION.GET_WALLET_BY_ID,
  useClass: GetWalletByIdApplication,
};
