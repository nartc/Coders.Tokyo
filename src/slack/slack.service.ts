import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';

import { GoogleSearchResponse, GoogleSearchService } from '../shared/google-search';
import { ConfigKey } from '../shared/configuration/configuration.enum';
import { ConfigurationService } from '../shared/configuration/configuration.service';
import { Helpers } from '../shared/utils/helpers';

@Injectable()
export class SlackService {

  constructor(private readonly googleSearchService: GoogleSearchService,
              private readonly configService: ConfigurationService) {
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
