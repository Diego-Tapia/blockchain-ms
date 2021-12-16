import { EMassiveDetailStatus } from "../enums/massive-detail-status.enum";

export interface IMassiveIncreaseDetail {
  id: number;
  userId: string | number;
  amount: number;
  note?: string;
  status?: EMassiveDetailStatus;
  error?: string[];
}
