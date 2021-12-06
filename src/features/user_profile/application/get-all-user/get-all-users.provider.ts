import { UserTypes } from '../../user.types';
import { GetAllUsersApplication } from './get-all-users.application';

export const GetAllUsersApplicationProvider = {
  provide: UserTypes.APPLICATION.GET_ALL_USERS,
  useClass: GetAllUsersApplication,
};
