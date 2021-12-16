import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { TransactionType } from 'src/features/transaction/domain/entities/transaction-type.entity';
import { TransactionTypeModel } from 'src/shared/infrastructure/models/transaction-type.model';
import { TransactionModel } from 'src/shared/infrastructure/models/transaction.model';
import { IClientSession } from 'src/shared/infrastructure/services/helper-service/helper.service';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { ITransactionRepository } from './transaction-repository.interface';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(TransactionModel.name)
    private readonly transactionModel: Model<TransactionModel>,
    @InjectModel(TransactionTypeModel.name)
    private readonly transactionTypeModel: Model<TransactionTypeModel>
  ) { }

  public async create(transaction: Transaction, session?: IClientSession): Promise<Transaction> {
    const transactionModel = await new this.transactionModel(transaction.toModel()).save({ session });
    return Transaction.toEntity(transactionModel);
  }

  public async createType(transactionType: TransactionType): Promise<TransactionType> {
    const saveTransactionType = new this.transactionTypeModel(transactionType)
    let model = await saveTransactionType.save()
    return model ? TransactionType.toEntity(model) : null
  }

  public async findOneType(filter: FilterQuery<TransactionTypeModel>): Promise<TransactionType> {
    const model = await this.transactionTypeModel.findOne(filter).exec();
    return model ? TransactionType.toEntity(model) : null;
  }

  public async findTypeById(id: string): Promise<TransactionType> {
    const model = await this.transactionTypeModel.findById(id).exec();
    return model ? TransactionType.toEntity(model) : null;
  }

}





