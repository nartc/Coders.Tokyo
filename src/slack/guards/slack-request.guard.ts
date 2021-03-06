import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigKey } from '../../shared/configuration/configuration.enum';
import { ConfigurationService } from '../../shared/configuration/configuration.service';
import { SlackHelpers } from '../../shared/utils/slack-helpers';
import { SlackUnauthorizedException } from '../exception-filter/slack-unauthorized-exception';
import { SlashCommandPayload } from '../models';

@Injectable()
export class SlackRequestGuard implements CanActivate {
  constructor(private readonly configService: ConfigurationService) {
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (this.validateSlackRequest(request)) {
      return true;
    } else {
      throw new SlackUnauthorizedException('Unsafe Slack request');
    }
  }

  private validateSlackRequest(request): boolean {
    const ts = parseInt(request.headers['x-slack-request-timestamp'], 10);

    const currentTime = Math.floor(new Date().getTime() / 1000);

    if (Math.abs(currentTime - ts) > 300) {
      return false;
    }

    const slackSignature = request.headers['x-slack-signature'];
    const payload = request.body as SlashCommandPayload;
    const hash = SlackHelpers.hashBaseString(this.configService.get(ConfigKey.SLACK_SIGN_IN_TOKEN), payload, ts);
    return SlackHelpers.compareHmac(hash, slackSignature);
  }
}