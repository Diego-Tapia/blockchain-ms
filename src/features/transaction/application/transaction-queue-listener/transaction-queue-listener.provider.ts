import { TransactionTypes } from '../../transaction.types';
import { TransactionQueueListenerApplication } from "./transaction-queue-listener.application";

export const TransactionQueueListenerApplicationProvider = {
  provide: TransactionTypes.APPLICATION.TRANSACTION_LISTENER,
  useClass: TransactionQueueListenerApplication,
};