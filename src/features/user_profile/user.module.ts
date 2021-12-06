import { Module } from '@nestjs/common';
import { UserRepositoryProvider } from './infrastructure/repositories/user-repository.provider';
import { GetAllUsersApplicationProvider } from './application/get-all-user/get-all-users.provider';
import { GetUserByIdApplicationProvider } from './application/get-user-by-id/get-user-by-id.provider';

@Module({
  controllers: [],
  imports: [],
  providers: [
    UserRepositoryProvider,
    GetAllUsersApplicationProvider,
    GetUserByIdApplicationProvider,
  ],
  exports: [UserRepositoryProvider]
})
export class UserFeatureModule {}
