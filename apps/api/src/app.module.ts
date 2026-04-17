import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DronesModule } from './drones/drones.module';
import { UsersModule } from './users/users.module';
import configuration from './config/configuration';
import { validate } from './config/validation';

const nodeEnv = process.env.NODE_ENV ?? 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      // 环境变量文件路径
      envFilePath: [
        `.env.${nodeEnv}`,                // 如 .env.development
        '.env',                           // 默认
      ],
      load: [configuration],
      validate,
      isGlobal: true,
      cache: true,
    }),
    DronesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
