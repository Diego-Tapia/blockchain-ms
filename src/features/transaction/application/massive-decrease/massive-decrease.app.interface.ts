import { ITransactionQueueMessage } from "src/features/transaction/domain/interfaces/transaction-queue-message.interface";

export interface IMassiveDecreaseApplication {
  execute(transactionQueueMessage: ITransactionQueueMessage): void;
}
