import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApplicabilityModel } from './applicability.model';
import { ClientModel } from './client.model';
import { TransactionTypeModel } from './transaction-type.model';

type IInternalTokenModelProps = {
  shortName: string;
  description?: string;
  symbol: string;
  price: number;
  money: string;
  status: string;
  validFrom?: Date;
  validTo?: Date;
  bcItemId: number;
  clientId: ClientModel;
  operations: TransactionTypeModel[];
  applicabilities: ApplicabilityModel[];
  emited: boolean;
}

export type ITokenModelProps = IInternalTokenModelProps & { _id: Types.ObjectId };
@Schema({
  timestamps: true,
})
export class TokenModel extends Document implements IInternalTokenModelProps {

  @Prop({ required: true, maxlength: 30 })
  shortName: string;

  @Prop()
  description?: string;

  @Prop({ required: true, maxlength: 5 })
  symbol: string;

  @Prop({ required: true, min: 1 })
  price: number;

  @Prop({ required: true, maxlength: 5 })
  money: string;

  @Prop({ required: true, enum: ['ACTIVE', 'BLOCKED', 'PENDING_APPROVE', 'INACTIVE'] })
  status: string;

  @Prop()
  validFrom?: Date;

  @Prop()
  validTo?: Date;

  @Prop({ required: true, min: 0 })
  bcItemId: number;

  @Prop({ type: Types.ObjectId, ref: ClientModel.name })
  clientId: ClientModel;

  @Prop({ type: [{ type: Types.ObjectId, ref: TransactionTypeModel.name }] })
  operations: TransactionTypeModel[];

  @Prop({ type: [{ type: Types.ObjectId, ref: ApplicabilityModel.name }] })
  applicabilities: ApplicabilityModel[];

  @Prop({ required: true, default: false })
  emited: boolean
}

export const TokenSchema = SchemaFactory.createForClass(TokenModel);
