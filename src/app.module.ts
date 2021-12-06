import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './api/healthCheck/healthCheck.controller';
import { DatabaseModule } from './configs/database/database.module';
import configs from './configs/environments/configs';
import envValidations from './configs/environments/env.validations';
import { AuthFeatureModule } from './features/auth/auth.module';
import { HealthService } from './features/healthCheck/healthCheck.service';
import { TokenFeatureModule } from './features/token/token.module';
import { TransactionModule } from './features/transaction/transaction.module';
import { UserFeatureModule } from './features/user_profile/user.module';
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
    TransactionModule,
    WalletFeatureModule,
    SharedModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}
