import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import configs from '../environments/configs';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof configs>): MongooseModuleOptions => {
        const { engine, name, host, user, pass, port } = configService.database;
        return {
          uri: `${engine}://${host}:${port}`,
          user,
          pass,
          dbName: name,
          //replicaSet: "rs0",
        };
      },
      inject: [configs.KEY],
    }),
  ],
})
export class DatabaseModule { }
