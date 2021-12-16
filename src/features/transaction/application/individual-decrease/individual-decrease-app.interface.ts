import { ITransactionQueueMessage } from '../../domain/interfaces/transaction-queue-message.interface';

export interface IIndividualDecreaseApplication {
  execute(transaction: ITransactionQueueMessage): Promise<void>;
}