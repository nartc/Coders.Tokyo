import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlackModule } from './slack/slack.module';
import { SharedModule } from './shared/shared.module';
import { ConfigurationService } from './shared/configuration/configuration.service';

@Module({
  imports: [SlackModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  static port: number;

  constructor(private readonly configService: ConfigurationService) {
    AppModule.port = configService.port;
  }
}
