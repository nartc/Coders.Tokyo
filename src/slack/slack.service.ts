import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';

import { GoogleSearchResponse, GoogleSearchService } from '../shared/google-search';
import { ConfigKey } from '../shared/configuration/configuration.enum';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import { Helpers } from '../shared/utils/helpers';
import { BotMessage, SlashCommandPayload } from './models';

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

    this.httpService.post(response_url, message)
      .pipe(Helpers.catchObservableError)
      .toPromise();
  }

  async searchSo(): Promise<GoogleSearchResponse> {
    return this.googleSearchService.search('javascript reduce', this.configService.get(ConfigKey.GG_SEARCH_MDN_CX))
      .pipe(
        map((response: AxiosResponse<GoogleSearchResponse>) => response.data),
        Helpers.catchObservableError,
      )
      .toPromise();
  }
}
