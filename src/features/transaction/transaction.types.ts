export const TransactionTypes = {
  APPLICATION: {
    CREATE_TRANSACTION: Symbol('CreateTransactionApplication'),
  },
  INFRASTRUCTURE: {
    REPOSITORY: Symbol('TransactionRepository'),
  },
};
