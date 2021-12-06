import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IPrivateKey } from 'src/features/wallet/domain/interfaces/private-key.interface';
import { TokenModel } from './token.model';

type IInternalWalletModelProps = {
  address: string;
  privateKey: IPrivateKey;
  balances: Record<string, any>[];
}

export type IWalletModelProps = IInternalWalletModelProps & { _id: Types.ObjectId };
export type IBalanceModelProps = { tokenId: TokenModel, amount: number };

@Schema()
export class WalletModel extends Document implements IInternalWalletModelProps {

  @Prop()
  address: string;

  @Prop({ type: Object })
  privateKey: IPrivateKey;

  //no utilizar default [] porque se arruina con populate
  @Prop(raw([{
    tokenId: { type: Types.ObjectId, ref: TokenModel.name },
    amount: { type: Number }
  }]))
  balances: Array<Record<string, any>>;

}

export const WalletSchema = SchemaFactory.createForClass(WalletModel);
