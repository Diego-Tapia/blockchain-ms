import { FilterQuery } from 'mongoose';
import { User } from 'src/features/auth/domain/entities/user.entity';
import { UserModel } from 'src/shared/infrastructure/models/user.model';
import { UserProfile } from "../../domain/entities/user.entity";

export interface IUserRepository {
  findAll(): Promise<UserProfile[]>;
  findById(id: string): Promise<UserProfile>;
  findOne(dni: any): Promise<UserProfile>;
  findOneUser(user: string): Promise<UserProfile>;
  findUser(filter: FilterQuery<UserModel>): Promise<User>;
}
