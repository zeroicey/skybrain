import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DronesModule } from './drones/drones.module';

@Module({
  imports: [DronesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
