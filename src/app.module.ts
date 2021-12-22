import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './configs/database/database.module';
import configs from './configs/environments/configs';
import envValidations from './configs/environments/env.validations';
import { AuthFeatureModule } from './features/auth/auth.module';
import { TokenFeatureModule } from './features/token/token.module';
import { TransactionFeatureModule } from './features/transaction/transaction.module';
import { UserFeatureModule } from './features/user_profile/user.module';
import { WalletsByClientsFeatureModule } from './features/wallestByClients/walletsByClients.module';
import { WalletFeatureModule } from './features/wallet/wallet.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configs],
      isGlobal: true,
      validationSchema: envValidations,
    }),
    TokenFeatureModule,
    DatabaseModule,
    AuthFeatureModule,
    UserFeatureModule,
    TransactionFeatureModule,
    WalletFeatureModule,
    SharedModule,
    WalletsByClientsFeatureModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
