import { Global, HttpModule, Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration/configuration.module';
import { GoogleSearchService } from './google-search/google-search.service';

@Global()
@Module({
  providers: [GoogleSearchService],
  imports: [ConfigurationModule, HttpModule.register({
    timeout: 5000,
    headers: {
      'content-type': 'application/json',
    },
  })],
  exports: [ConfigurationModule, GoogleSearchService],
})
export class SharedModule {
}
