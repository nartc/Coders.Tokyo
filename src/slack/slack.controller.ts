import { Body, Controller, Get, InternalServerErrorException, Post, UseFilters, UseGuards } from '@nestjs/common';
import { GoogleSearchResponse } from '../shared/google-search';
import { SlackHelpers } from '../shared/utils/slack-helpers';
import { SlackUnauthorizedExceptionFilter } from './exception-filter/slack-unauthorized-exception.filter';
import { SlackRequestGuard } from './guards/slack-request.guard';
import { BotMessage, SlashCommandPayload } from './models';
import { SlackService } from './slack.service';

@Controller('slack')
@UseFilters(new SlackUnauthorizedExceptionFilter())
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
  @UseGuards(SlackRequestGuard)
  async handleInfo(@Body() data: SlashCommandPayload): Promise<BotMessage> {
    try {
      this.slackService.handleInfo(data);
      return SlackHelpers.getImmediateResponse();
    } catch (e) {
      return SlackHelpers.getErrorResponse(e);
    }
  }

  @Post('mdn')
  @UseGuards(SlackRequestGuard)
  async handleMdn(@Body() data: SlashCommandPayload): Promise<BotMessage> {
    try {
      this.slackService.handleMdn(data);
      return SlackHelpers.getImmediateResponse();
    } catch (e) {
      return SlackHelpers.getErrorResponse(e);
    }
  }
}
