import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserModel } from './user.model';
@Schema({
  timestamps: true,
})
export class UserProfileModel extends Document {

  @Prop({ type: Types.ObjectId, ref: UserModel.name })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  shortName: string;

  @Prop({ required: true })
  lastName: string;

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
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfileModel);
