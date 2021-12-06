import { UserProfile } from '../../domain/entities/user.entity';

export interface IGetUserpplication {
  execute(param: string | number): Promise<UserProfile>;
}
