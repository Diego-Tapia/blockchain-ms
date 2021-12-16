import { EMassiveDetailStatus } from "../enums/massive-detail-status.enum";
import { IMassiveDecreaseDetail } from "../interfaces/massive-decrease-detail-entity.interface";

export class MassiveDecreaseDetail {
  id: number;
  userId: string | number;
  amount: number;
  note?: string;
  status?: EMassiveDetailStatus;
  error?: string[];
  
  constructor({
    id,
    userId,
    amount,
    note,
    status,
    error }: IMassiveDecreaseDetail,
  ) {
    this.id = id
    this.userId = userId;
    this.amount = amount;
    this.note = note;
    this.status = status;
    this.error = error;
  }
}