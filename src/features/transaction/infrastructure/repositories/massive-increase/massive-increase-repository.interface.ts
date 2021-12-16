import { FilterQuery, UpdateQuery } from "mongoose";
import { MassiveIncrease } from 'src/features/transaction/domain/entities/massive-increase.entity';
import { MassiveIncreaseModel } from 'src/shared/infrastructure/models/massive-increase.model';


export interface IMassiveIncreaseRepository {
  create(token: MassiveIncrease): Promise<MassiveIncrease>;
  findAll(filter?: FilterQuery<MassiveIncreaseModel>): Promise<MassiveIncrease[]>;
  findById(id: string): Promise<MassiveIncrease>;
  update(id: string, updateQuery: UpdateQuery<MassiveIncreaseModel>): Promise<MassiveIncrease>
}
