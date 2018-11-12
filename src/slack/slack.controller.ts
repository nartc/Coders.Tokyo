import { Body, Controller, Get, InternalServerErrorException, Post, Req } from '@nestjs/common';
import { stringify } from 'querystring';
import { GoogleSearchResponse } from '../shared/google-search';
import { SlackHelpers } from '../shared/utils/slack-helpers';
import { BotMessage, SlashCommandPayload } from './models';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {

  constructor(private readonly slackService: SlackService) {
  }

  @Get('test')
  async testSearchStackoverflow(): Promise<GoogleSearchResponse> {
    try {
      return await this.slackService.searchSo();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Post('info')
  async handleInfo(@Body() data: SlashCommandPayload, @Req() request): Promise<BotMessage> {
    console.log({ headers: request.headers, body: request.body });
    console.log({stringBody: stringify(data)});
    try {
      this.slackService.handleInfo(data);
      return SlackHelpers.getImmediateResponse();
    } catch (e) {
      return SlackHelpers.getErrorResponse(e);
    }
  }
}
