import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionModel } from 'src/shared/infrastructure/models/transaction.model';
import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from './transaction-repository.interface';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(TransactionModel.name) private readonly transactionModel: Model<TransactionModel>,
  ) { }

  public async create(transaction: Transaction, session?: IClientSession): Promise<Transaction> {
    const transactionModel = await new this.transactionModel(transaction.toModel()).save({ session });
    return Transaction.toEntity(transactionModel);
  }

}
