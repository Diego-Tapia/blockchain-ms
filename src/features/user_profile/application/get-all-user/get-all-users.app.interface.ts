import { UserProfile } from '../../domain/entities/user.entity';

export interface IGetAllUsersApplication {
  execute(): Promise<UserProfile[]>;
}
