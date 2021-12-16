import { TransactionTypes } from '../../transaction.types';
import { TransferApplication } from './transfer.application';

export const TransferApplicationProvider = {
  provide: TransactionTypes.APPLICATION.TRANSFER,
  useClass: TransferApplication,
};
