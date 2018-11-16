import { Body, Controller, Get, InternalServerErrorException, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigKey } from '../shared/configuration/configuration.enum';
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
      this.slackService.handleSearch(data, ConfigKey.GG_SEARCH_MDN_CX);
      return SlackHelpers.getImmediateResponse();
    } catch (e) {
      return SlackHelpers.getErrorResponse(e);
    }
  }

  @Post('so')
  @UseGuards(SlackRequestGuard)
  async handleSo(@Body() data: SlashCommandPayload): Promise<BotMessage> {
    try {
      this.slackService.handleSearch(data, ConfigKey.GG_SEARCH_SO_CX);
      return SlackHelpers.getImmediateResponse();
    } catch (e) {
      return SlackHelpers.getErrorResponse(e);
    }
  }

  @Post('w3s')
  @UseGuards(SlackRequestGuard)
  async handleW3s(@Body() data: SlashCommandPayload): Promise<BotMessage> {
    try {
      this.slackService.handleSearch(data, ConfigKey.GG_SEARCH_W3S_CX);
      return SlackHelpers.getImmediateResponse();
    } catch (e) {
      return SlackHelpers.getErrorResponse(e);
    }
  }
}
