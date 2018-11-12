import { createHmac, timingSafeEqual } from 'crypto';
import { stringify } from 'querystring';
import { BotMessage, SlashCommandPayload } from '../../slack/models';

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

  static hashBaseString(slackSignature: Buffer, payload: SlashCommandPayload, ts: number) {
    const hmac = createHmac('sha256', slackSignature);
    const sigBaseString = `v0:${ts}:${stringify(payload)}`;
    return `v0=${hmac.update(sigBaseString).digest()}`;
  }

  static compareHmac(signature, slackSignature): boolean {
    return timingSafeEqual(signature, slackSignature);
  }
}