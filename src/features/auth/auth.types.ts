export const UserAuthTypes = {
  APPLICATION: {
    USER_REGISTER: Symbol('UserRegisterApplication'),
    USER_CONFIRM: Symbol('UserConfirmApplication'),
    USER_LOGIN: Symbol('UserLoginApplication'),
  },
  INFRASTRUCTURE: {
    REPOSITORY: Symbol('UserAuthRepository'),
  },
};
