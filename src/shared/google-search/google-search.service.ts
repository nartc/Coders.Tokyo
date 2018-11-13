import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

import { ConfigurationService } from '../configuration/configuration.service';
import { GoogleSearchResponse } from './google-search-response.model';
import { ConfigKey } from '../configuration/configuration.enum';
import { GG_SEARCH_URL } from '../constants';

@Injectable()
export class GoogleSearchService {
  private baseUrl: string;

  constructor(private readonly configService: ConfigurationService,
              private readonly httpService: HttpService) {
    this.baseUrl = GG_SEARCH_URL.replace('{key}', configService.get(ConfigKey.GG_SEARCH_API_KEY));
  }

  search(query: string, cx: string): Observable<AxiosResponse<GoogleSearchResponse>> {
    const url = this.baseUrl.replace('{cx}', cx).concat(query);
    return this.httpService.get<GoogleSearchResponse>(url);
  }
}
