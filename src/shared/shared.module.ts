import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdministratorModel, AdministratorSchema } from './infrastructure/models/administrator.model';
import { ApplicabilityModel, ApplicabilitySchema } from './infrastructure/models/applicability.model';
import { ClientConfigModel, ClientConfigSchema } from './infrastructure/models/client-config.model';
import { ClientModel, ClientSchema } from './infrastructure/models/client.model';
import { TokenModel, TokenSchema } from './infrastructure/models/token.model';
import { TransactionTypeModel, TransactionTypeSchema } from './infrastructure/models/transaction-type.model';
import { TransactionModel, TransactionSchema } from './infrastructure/models/transaction.model';
import { UserProfileModel, UserProfileSchema } from './infrastructure/models/user-profile.model';
import { UserModel, UserSchema } from './infrastructure/models/user.model';
import { WalletModel, WalletSchema } from './infrastructure/models/wallet.model';
import { HelperServiceProvider } from './infrastructure/services/helper-service/helper-service.provider';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdministratorModel.name, schema: AdministratorSchema },
      { name: ApplicabilityModel.name, schema: ApplicabilitySchema },
      { name: ClientConfigModel.name, schema: ClientConfigSchema },
      { name: ClientModel.name, schema: ClientSchema },
      { name: TokenModel.name, schema: TokenSchema },
      { name: TransactionTypeModel.name, schema: TransactionTypeSchema },
      { name: TransactionModel.name, schema: TransactionSchema },
      { name: UserProfileModel.name, schema: UserProfileSchema },
      { name: UserModel.name, schema: UserSchema },
      { name: WalletModel.name, schema: WalletSchema }
    ])
  ],
  providers: [HelperServiceProvider],
  exports: [MongooseModule, HelperServiceProvider]
})
export class SharedModule { }
