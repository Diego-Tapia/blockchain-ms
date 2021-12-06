import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ClientModel } from './client.model';
import { WalletModel } from './wallet.model';

@Schema({
  timestamps: true,
})
export class UserModel extends Document {

  @Prop({ required: true })
  customId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, enum: ['ACTIVE', 'BLOCKED', 'PENDING_APPROVE', 'INACTIVE'] })
  status: string;

  @Prop({ type: Types.ObjectId, ref: ClientModel.name })
  clientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: WalletModel.name })
  walletId: Types.ObjectId;

  @Prop()
  isWalletManager: boolean;

}

export const UserSchema = SchemaFactory.createForClass(UserModel);
