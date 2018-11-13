import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { ConfigKey } from '../shared/configuration/configuration.enum';
import { ConfigurationService } from '../shared/configuration/configuration.service';

import { GoogleSearchResponse, GoogleSearchService } from '../shared/google-search';
import { Helpers } from '../shared/utils/helpers';
import { SlackHelpers } from '../shared/utils/slack-helpers';
import { BotMessage, MessageAttachment, SlashCommandPayload } from './models';

@Injectable()
export class SlackService {

  constructor(private readonly googleSearchService: GoogleSearchService,
              private readonly configService: ConfigurationService,
              private readonly httpService: HttpService) {
  }

  async handleInfo(payload: SlashCommandPayload): Promise<void> {
    const { response_url } = payload;
    const message: BotMessage = {
      text: 'Info is being constructed',
      replace_original: true,
      delete_original: true,
      response_type: 'in_channel',
    };

    this.sendResponse(response_url, message);
  }

  async handleMdn(payload: SlashCommandPayload): Promise<void> {
    const { response_url, text } = payload;
    try {
      const response = await this.search(text, ConfigKey.GG_SEARCH_MDN_CX);
      const messageAttachment: MessageAttachment[] = SlackHelpers.getSuccessAttachment(response);
      const message: BotMessage = SlackHelpers.getSuccessMessage(messageAttachment);

      this.sendResponse(response_url, message);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async searchSo(): Promise<GoogleSearchResponse> {
    return this.googleSearchService.search('javascript reduce', this.configService.get(ConfigKey.GG_SEARCH_MDN_CX))
      .pipe(
        map((response: AxiosResponse<GoogleSearchResponse>) => response.data),
        Helpers.catchObservableError,
      )
      .toPromise();
  }

  private search(query: string, cx: ConfigKey): Promise<GoogleSearchResponse> {
    return this.googleSearchService.search(query, this.configService.get(cx))
      .pipe(
        map((response: AxiosResponse<GoogleSearchResponse>) => response.data),
        Helpers.catchObservableError,
      )
      .toPromise();
  }

  private sendResponse(url: string, message: BotMessage) {
    this.httpService.post(url, message)
      .pipe(Helpers.catchObservableError)
      .toPromise();
  }
}
