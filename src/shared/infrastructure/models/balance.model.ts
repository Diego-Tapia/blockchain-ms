import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TokenModel } from './token.model';

@Schema()
export class BalanceModel extends Document {

  @Prop({ type: Types.ObjectId, ref: TokenModel.name })
  tokenId: Types.ObjectId;

  @Prop()
  amount: number;
}

export const BalanceSchema = SchemaFactory.createForClass(BalanceModel);