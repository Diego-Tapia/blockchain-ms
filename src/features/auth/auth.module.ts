import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configs from 'src/configs/environments/configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configs],
      isGlobal: true,
    }),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class AuthFeatureModule {}
