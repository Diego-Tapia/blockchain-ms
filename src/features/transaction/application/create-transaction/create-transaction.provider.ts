import { TransactionTypes } from '../../transaction.types';
import { CreateTransactionApplication } from './create-transaction.application';

export const CreateTransactionApplicationProvider = {
  provide: TransactionTypes.APPLICATION.CREATE_TRANSACTION,
  useClass: CreateTransactionApplication,
};
