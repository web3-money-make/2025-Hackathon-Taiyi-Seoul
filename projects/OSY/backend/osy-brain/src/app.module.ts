import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ApiController } from './api/api.controller';
import { ApiService } from './api/api.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronService } from './cron/cron.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController, ApiController],
  providers: [AppService, CronService, ApiService],
})
export class AppModule {}
