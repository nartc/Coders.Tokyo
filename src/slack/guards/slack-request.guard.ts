import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { ConfigurationService } from '../../shared/configuration/configuration.service';
import { Helpers } from '../../shared/utils/helpers';
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
    const slackSignature = request.headers['x-slack-signature'];
    const payload = request.body as SlashCommandPayload;
    const hash = SlackHelpers.hashBaseString(this.configService.slackSignInToken, payload, ts);
    return SlackHelpers.compareHmac(hash, Helpers.toBuffer(slackSignature));
  }
}