import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EMassiveStatus } from 'src/features/transaction/domain/enums/massive-status.enum';
import { AdminModel } from 'src/shared/infrastructure/models/admin.model';
import { ClientModel } from 'src/shared/infrastructure/models/client.model';
import { TokenModel } from 'src/shared/infrastructure/models/token.model';
import { MassiveIncreaseDetail } from '../../../features/transaction/domain/entities/massive.increase-detail.entity';


@Schema({
  timestamps: true,
})
export class MassiveIncreaseModel extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: EMassiveStatus })
  status: EMassiveStatus;

  @Prop({ required: true, ref: TokenModel.name })
  tokenId: Types.ObjectId;

  @Prop({ required: true, ref: AdminModel.name })
  adminId: Types.ObjectId;

  @Prop({ required: true, ref: ClientModel.name })
  clientId: Types.ObjectId;

  @Prop({ })
  recordLengthTotal: number;

  @Prop({  })
  recordLengthValidatedOk: number;

  @Prop({  })
  recordLengthValidatedError: number;
  
  @Prop({  })
  totalAmountValidated: number;

  @Prop({  })
  totalAmountExecuted: number;
  
  @Prop({  })
  recordLengthExecutedOk: number;

  @Prop({  })
  recordLengthExecutedError: number;
  
  @Prop({ required: true})
  detail: Array<MassiveIncreaseDetail> 

  @Prop({})
  createdAt: Date;
  
  @Prop({ })
  updatedAt: Date;
}

export const MassiveIncreaseSchema = SchemaFactory.createForClass(MassiveIncreaseModel);
