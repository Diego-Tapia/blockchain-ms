export const TransactionTypes = {
  APPLICATION: {
    INDIVIDUAL_INCREASE: Symbol('IndividualIncreaseApplication'),
    INDIVIDUAL_DECREASE: Symbol('IndividualDecreaseApplication'),
    TRANSACTION_LISTENER: Symbol('TransactionListenerApplication'),
    MASSIVE_DECREASE: Symbol('MassiveDecreaseApplication'),
    MASSIVE_INCREASE: Symbol('MassiveIncreaseApplication'),
    TRANSFER: Symbol('Transfer'),
  },
  INFRASTRUCTURE: {
    TRANSACTION_REPOSITORY: Symbol('TransactionRepository'),
    MASSIVE_DECREASE_REPOSITORY: Symbol('MassiveDecreaseRepository'),
    MASSIVE_INCREASE_REPOSITORY: Symbol('MassiveIncreaseRepository'),
    MESSAGE_QUEUE_TRANSACTION_SERVICE: Symbol('MessageQueueTransactionService')
  },
};
