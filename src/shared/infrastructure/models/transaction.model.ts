import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TokenModel } from './token.model';
import { UserModel } from './user.model';
import { WalletModel } from './wallet.model';

@Schema({
  timestamps: true,
})
export class TransactionModel extends Document {

  @Prop({ required: true })
  hash: string;

  @Prop({ type: Types.ObjectId, ref: TransactionModel.name})
  transactionTypeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: TokenModel.name})
  tokenId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: WalletModel.name})
  walletFromId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: WalletModel.name})
  walletToId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: UserModel.name })
  userId: Types.ObjectId;

  @Prop({ required: true })
  notes: string;

}

export const TransactionSchema = SchemaFactory.createForClass(TransactionModel);
