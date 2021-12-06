import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserProfile } from '../../domain/entities/user.entity';
import { IUserRepository } from './user-repository.interface';
import { UserProfileModel } from 'src/shared/infrastructure/models/user-profile.model';
import { UserModel } from 'src/shared/infrastructure/models/user.model';
import { User } from 'src/features/auth/domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserProfileModel.name) private readonly userProfileModel: Model<UserProfileModel>,
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>
  ) { }


  public async findAll(): Promise<UserProfile[]> {
    const userModels = await this.userProfileModel.find().exec();
    return userModels.map((user) => this.toDomainEntity(user));
  }

  public async findById(id: string): Promise<UserProfile> {
    const userModel = await this.userProfileModel.findById(id).exec();
    return this.toDomainEntity(userModel);
  }

  public async findOne(dni: number): Promise<UserProfile> {
    const userModel = await this.userProfileModel.findOne({ dni: dni }).exec();
    return userModel ? this.toDomainEntity(userModel) : null;
  }

  public async findOneUser(username: string): Promise<UserProfile> {
    const userModel = await this.userProfileModel.findOne({ username: username }).exec();
    return userModel ? this.toDomainEntity(userModel) : null;
  }

  private toDomainEntity(model: UserProfileModel): UserProfile {
    const { user_id, shortName, lastName, dni, cuil, avatar_url, email, phoneNumber } = model;
    const userEntity = new UserProfile(
      shortName,
      lastName,
      dni,
      cuil,
      avatar_url,
      email,
      phoneNumber,
      user_id.toString()
    );
    return userEntity;
  }

  public async findUser(filter: FilterQuery<UserModel>): Promise<User> {
    const userModel = await this.userModel
      .findOne(filter)
      //.populate('walletId')
      .lean()
      .exec();

    return userModel ? User.toEntity(userModel) : null;
  }
}
