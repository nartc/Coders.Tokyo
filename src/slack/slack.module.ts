import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { GoogleSearchService } from '../shared/google-search';

@Module({
  controllers: [SlackController],
  providers: [SlackService, GoogleSearchService],
})
export class SlackModule {
}
