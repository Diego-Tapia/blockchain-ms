import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import configs from '../environments/configs';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof configs>): MongooseModuleOptions => {
        const {  uri } = configService.database;
        return {
          uri
        };
      },
      inject: [configs.KEY],
    }),
  ],
})
export class DatabaseModule { }
