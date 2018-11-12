import { createHmac, timingSafeEqual } from 'crypto';
import { stringify } from 'qs';
import { BotMessage, SlashCommandPayload } from '../../slack/models';
import { Helpers } from './helpers';

export class SlackHelpers {
  static defaultMessage: BotMessage = {
    response_type: 'ephemeral',
    delete_original: true,
    replace_original: true,
  };

  static getImmediateResponse(): BotMessage {
    return {
      ...SlackHelpers.defaultMessage,
      text: 'Got it!',
    };
  }

  static getErrorResponse(e): BotMessage {
    return {
      ...SlackHelpers.defaultMessage,
      text: e.message,
    };
  }

  static hashBaseString(slackSignature: string, payload: SlashCommandPayload, ts: number): string {
    const hmac = createHmac('sha256', slackSignature);
    const sigBaseString = `v0:${ts}:${stringify(payload, { format: 'RFC1738' })}`;
    return `v0=${hmac.update(sigBaseString, 'utf8').digest('hex')}`;
  }

  static compareHmac(signature: string, slackSignature: string): boolean {
    return timingSafeEqual(Helpers.toBuffer(signature), Helpers.toBuffer(slackSignature));
  }
}