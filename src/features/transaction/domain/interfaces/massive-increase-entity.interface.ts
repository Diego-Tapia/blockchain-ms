import { MassiveIncreaseDetail } from "../../../transaction/domain/entities/massive.increase-detail.entity";
import { EMassiveStatus } from "../enums/massive-status.enum";

export interface IMassiveIncrease {
  name: string;
  status: EMassiveStatus;
  tokenId: string;
  adminId: string;
  clientId: string;
  detail: MassiveIncreaseDetail[];
  id?: string;
  recordLengthTotal?: number;
  recordLengthValidatedOk?: number;
  recordLengthValidatedError?: number;
  totalAmountValidated?: number;
  totalAmountExecuted?: number  
  recordLengthExecutedOk?: number;
  recordLengthExecutedError?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
