import { ITransactionQueueMessage } from '../../domain/interfaces/transaction-queue-message.interface';

export interface IIndividualIncreaseApplication {
  execute(transaction: ITransactionQueueMessage): Promise<void>;
}