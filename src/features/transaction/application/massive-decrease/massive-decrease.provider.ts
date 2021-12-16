import { TransactionTypes } from '../../transaction.types';
import { MassiveDecreaseApplication } from "./massive-decrease.application";

export const MassiveDecreaseApplicationProvider = {
  provide: TransactionTypes.APPLICATION.MASSIVE_DECREASE,
  useClass: MassiveDecreaseApplication,
};
