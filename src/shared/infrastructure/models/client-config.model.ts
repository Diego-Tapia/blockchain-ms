import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ClientModel } from './client.model';

@Schema({
  timestamps: true,
})
export class ClientConfigModel extends Document {

  @Prop({ type: Types.ObjectId, ref: ClientModel.name })
  client_id: Types.ObjectId;

  @Prop({ required: true })
  logo: string;

  @Prop({ required: true })
  banner: string;

  @Prop({ required: true})
  main_color: string;

  @Prop({ required: true })
  secondary_color : string;

  @Prop({ required: true })
  domain: number;

  @Prop({ required: true })
  verify_user: string;

}

export const ClientConfigSchema = SchemaFactory.createForClass(ClientConfigModel);
