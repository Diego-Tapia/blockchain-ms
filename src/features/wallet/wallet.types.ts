export const WalletTypes = {
  APPLICATION: {
    CREATE_WALLET: Symbol('CreateWalletApplication'),
    GET_ALL_WALLETS: Symbol('GetAllWalletsApplication'),
    GET_WALLET_BY_ID: Symbol('GetWalletByIdApplication'),
  },
  INFRASTRUCTURE: {
    REPOSITORY: Symbol('WalletRepository'),
  },
};
