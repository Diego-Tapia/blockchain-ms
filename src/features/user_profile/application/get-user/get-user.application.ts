import { Injectable, Inject } from '@nestjs/common';
import { UserProfile } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../infrastructure/repositories/user-repository.interface';
import { UserTypes } from '../../user.types';
import { IGetUserpplication } from './get-user-app.interface';

@Injectable()
export class GetUserApplication implements IGetUserpplication {
  constructor(
    @Inject(UserTypes.INFRASTRUCTURE.REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  public execute(dni: number): Promise<UserProfile> {
    return this.userRepository.findOne(dni);
  }
}
