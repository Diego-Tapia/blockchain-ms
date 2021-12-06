import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ClientModel } from './client.model';

@Schema({
  timestamps: true,
})
export class AdministratorModel extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  dni: number;
  
  @Prop({ required: true })
  cuil: number;

  @Prop({ required: true })
  avatar_url: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: number;

  @Prop({ required: true })
  rol_id: string;

  @Prop({ type: Types.ObjectId, ref: ClientModel.name })
  client_id: Types.ObjectId;

  @Prop({ required: true })
  username: string;

}

export const AdministratorSchema = SchemaFactory.createForClass(AdministratorModel);
