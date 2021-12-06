import { Injectable, Inject } from '@nestjs/common';
import { UserProfile } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../infrastructure/repositories/user-repository.interface';
import { UserTypes } from '../../user.types';
import { IGetUserByIdApplication } from './get-user-by-id-app.interface';

@Injectable()
export class GetUserByIdApplication implements IGetUserByIdApplication {
  constructor(
    @Inject(UserTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  public execute(id: string): Promise<UserProfile> {
    return this.userRepository.findById(id);
  }
}
