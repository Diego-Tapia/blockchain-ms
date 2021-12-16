import { ITransactionQueueMessage } from "src/features/transaction/domain/interfaces/transaction-queue-message.interface";

export interface IMassiveIncreaseApplication {
  execute(transactionQueueMessage: ITransactionQueueMessage): void;
}
