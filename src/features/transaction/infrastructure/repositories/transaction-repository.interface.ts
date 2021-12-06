import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';
import { Transaction } from '../../domain/entities/transaction.entity';
export interface ITransactionRepository {
  create(transaction: Transaction, session?: IClientSession): Promise<Transaction>;
}

