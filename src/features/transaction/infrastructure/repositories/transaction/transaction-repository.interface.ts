import { FilterQuery } from 'mongoose';
import { TransactionType } from 'src/features/transaction/domain/entities/transaction-type.entity';
import { TransactionTypeModel } from 'src/shared/infrastructure/models/transaction-type.model';
import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';
import { Transaction } from '../../../domain/entities/transaction.entity';
export interface ITransactionRepository {
  create(transaction: Transaction, session?: IClientSession): Promise<Transaction>;
  createType(transactionType: TransactionType): Promise<TransactionType>;
  findTypeById(id: string): Promise<TransactionType>;
  findOneType(filter: FilterQuery<TransactionTypeModel>): Promise<TransactionType>;
}

