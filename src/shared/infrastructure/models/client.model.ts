import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

type IInternalClientModelProps = {
  name: string;
  cuit: number;
  businessName: string;
  responsible: string;
  phoneNumber: number;
  email: string;
  status: string;
  industry: string;
}

export type IClientModelProps = IInternalClientModelProps & { _id: Types.ObjectId };

@Schema({
  timestamps: true,
})
export class ClientModel extends Document implements IInternalClientModelProps {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cuit: number;

  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  responsible: string;

  @Prop({ required: true })
  phoneNumber: number;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  industry: string;

}

export const ClientSchema = SchemaFactory.createForClass(ClientModel);
