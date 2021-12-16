import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types} from 'mongoose';
import { ClientModel } from './client.model';

@Schema({
  timestamps: true,
})
export class ApplicabilityModel extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true})
  description: string;

  @Prop({ type: Types.ObjectId, ref: ClientModel.name })
  clientId: Types.ObjectId;

}

export const ApplicabilitySchema = SchemaFactory.createForClass(ApplicabilityModel);
