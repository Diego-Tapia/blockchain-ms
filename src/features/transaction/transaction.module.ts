import { Module } from '@nestjs/common';
import { TransactionController } from 'src/api/transaction/transaction.controller';
import { CreateTransactionApplicationProvider } from './application/create-transaction/create-transaction.provider';
import { TransactionRepositoryProvider } from './infrastructure/repositories/transaction-repository.provider';

@Module({
  controllers: [TransactionController],
  imports: [],
  providers: [
    TransactionRepositoryProvider,
    CreateTransactionApplicationProvider,
    TransactionRepositoryProvider,
  ],
  exports: [TransactionRepositoryProvider]
})
export class TransactionModule { }
