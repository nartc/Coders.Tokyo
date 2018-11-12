import { createHmac, timingSafeEqual } from 'crypto';
import { stringify } from 'querystring';
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

  static hashBaseString(slackSignature: string, payload: SlashCommandPayload, ts: number): Buffer {
    const hmac = createHmac('sha256', slackSignature);
    const sigBaseString = `v0:${ts}:${stringify(payload)}`;
    return Helpers.toBuffer(`v0=${hmac.update(sigBaseString).digest()}`);
  }

  static bufferizeSlackSignature(slackSignature: string): Buffer {
    const sig = slackSignature.split('=')[1];
    return Helpers.toBuffer(`v0=${sig}`);
  }

  static compareHmac(signature, slackSignature): boolean {
    return timingSafeEqual(signature, slackSignature);
  }
}