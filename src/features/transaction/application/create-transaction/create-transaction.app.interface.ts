import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransactionDto } from '../../infrastructure/dtos/create-transaction.dto';

export interface ICreateTransactionApplication {
  execute(createTransactionDto: CreateTransactionDto): Promise<Transaction>;
}
