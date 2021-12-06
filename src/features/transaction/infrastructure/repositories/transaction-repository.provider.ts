import { TransactionTypes } from '../../transaction.types';
import { TransactionRepository } from './transaction.repository';

export const TransactionRepositoryProvider = {
  provide: TransactionTypes.INFRASTRUCTURE.REPOSITORY,
  useClass: TransactionRepository,
};
