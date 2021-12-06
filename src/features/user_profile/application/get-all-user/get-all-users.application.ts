import { Injectable, Inject } from '@nestjs/common';
import { UserProfile } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../infrastructure/repositories/user-repository.interface';
import { UserTypes } from '../../user.types';
import { IGetAllUsersApplication } from './get-all-users.app.interface';

@Injectable()
export class GetAllUsersApplication implements IGetAllUsersApplication {
  constructor(
    @Inject(UserTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  public execute(): Promise<UserProfile[]> {
    return this.userRepository.findAll();
  }
}
