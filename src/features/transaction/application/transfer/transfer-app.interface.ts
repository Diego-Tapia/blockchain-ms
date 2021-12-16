import { ITransactionQueueMessage } from '../../domain/interfaces/transaction-queue-message.interface';

export interface ITransferApplication {
  execute(transaction: ITransactionQueueMessage): Promise<void>;
}
