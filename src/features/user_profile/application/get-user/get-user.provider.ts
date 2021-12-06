import { UserTypes } from '../../user.types';
import { GetUserApplication } from './get-user.application';

export const GetUserApplicationProvider = {
  provide: UserTypes.APPLICATION.GET_USER,
  useClass: GetUserApplication,
};
