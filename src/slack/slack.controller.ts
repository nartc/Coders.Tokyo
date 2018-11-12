import { Body, Controller, Get, InternalServerErrorException, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { stringify } from 'querystring';
import { GoogleSearchResponse } from '../shared/google-search';
import { SlackHelpers } from '../shared/utils/slack-helpers';
import { SlackUnauthorizedExceptionFilter } from './exception-filter/slack-unauthorized-exception.filter';
import { SlackRequestGuard } from './guards/slack-request.guard';
import { BotMessage, SlashCommandPayload } from './models';
import { SlackService } from './slack.service';

@Controller('slack')
@UseGuards(SlackRequestGuard)
@UseFilters(SlackUnauthorizedExceptionFilter)
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
    try {
      this.slackService.handleInfo(data);
      return SlackHelpers.getImmediateResponse();
    } catch (e) {
      return SlackHelpers.getErrorResponse(e);
    }
  }
}
