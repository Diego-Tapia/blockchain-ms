export const UserTypes = {
  APPLICATION: {
    GET_ALL_USERS: Symbol('GetAllUsersApplication'),
    GET_USER_BY_ID: Symbol('GetUserByIdApplication'),
    GET_USER: Symbol('GetUserApplication'),
  },
  INFRASTRUCTURE: {
    REPOSITORY: Symbol('UserRepository'),
  },
};
