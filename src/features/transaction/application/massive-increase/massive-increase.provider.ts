import { TransactionTypes } from '../../transaction.types';
import { MassiveIncreaseApplication } from "./massive-increase.application";

export const MassiveIncreaseApplicationProvider = {
  provide: TransactionTypes.APPLICATION.MASSIVE_INCREASE,
  useClass: MassiveIncreaseApplication,
};
