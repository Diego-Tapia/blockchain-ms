import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModel, AdminSchema } from './infrastructure/models/admin.model';
import { ApplicabilityModel, ApplicabilitySchema } from './infrastructure/models/applicability.model';
import { ClientConfigModel, ClientConfigSchema } from './infrastructure/models/client-config.model';
import { ClientModel, ClientSchema } from './infrastructure/models/client.model';
import { MassiveDecreaseModel, MassiveDecreaseSchema } from './infrastructure/models/massive-decrease.model';
import { MassiveIncreaseModel, MassiveIncreaseSchema } from './infrastructure/models/massive-increase.model';
import { TokenModel, TokenSchema } from './infrastructure/models/token.model';
import { TransactionTypeModel, TransactionTypeSchema } from './infrastructure/models/transaction-type.model';
import { TransactionModel, TransactionSchema } from './infrastructure/models/transaction.model';
import { UserProfileModel, UserProfileSchema } from './infrastructure/models/user-profile.model';
import { UserModel, UserSchema } from './infrastructure/models/user.model';
import { WalletModel, WalletSchema } from './infrastructure/models/wallet.model';
import { HelperServiceProvider } from './infrastructure/services/helper-service/helper-service.provider';
import { MessageQueueServiceProvider } from './infrastructure/services/message-queue-service/message-queue-listener.provider';
import { PromiseQueueServiceProvider } from './infrastructure/services/promise-queue/promise-queue.provider';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminModel.name, schema: AdminSchema },
      { name: ApplicabilityModel.name, schema: ApplicabilitySchema },
      { name: ClientConfigModel.name, schema: ClientConfigSchema },
      { name: ClientModel.name, schema: ClientSchema },
      { name: TokenModel.name, schema: TokenSchema },
      { name: TransactionTypeModel.name, schema: TransactionTypeSchema },
      { name: TransactionModel.name, schema: TransactionSchema },
      { name: UserProfileModel.name, schema: UserProfileSchema },
      { name: UserModel.name, schema: UserSchema },
      { name: WalletModel.name, schema: WalletSchema },
      { name: MassiveDecreaseModel.name, schema: MassiveDecreaseSchema },
      { name: MassiveIncreaseModel.name, schema: MassiveIncreaseSchema },
    ])
  ],
  providers: [
    HelperServiceProvider, 
    MessageQueueServiceProvider,
    PromiseQueueServiceProvider
  ],
  exports: [
    MongooseModule, 
    HelperServiceProvider, 
    MessageQueueServiceProvider,
    PromiseQueueServiceProvider
  ]
})
export class SharedModule { }
