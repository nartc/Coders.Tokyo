import { createHmac, timingSafeEqual } from 'crypto';
import { stringify } from 'qs';
import { BotMessage, MessageAttachment, SlashCommandPayload } from '../../slack/models';
import { GoogleSearchResponse } from '../google-search';
import { Helpers } from './helpers';

const SUCCESS_COLOR = 'success';
const ERROR_COLOR = 'danger';
const FALLBACK_STRING = 'Channel does not support me';
const FOOTER_STRING = 'Coders.Tokyo Slackbot';

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

  static getSuccessAttachment(response: GoogleSearchResponse): MessageAttachment[] {
    return [
      {
        fallback: FALLBACK_STRING,
        color: SUCCESS_COLOR,
        footer: FOOTER_STRING,
        text: response.items[0].snippet,
        title: response.items[0].title,
        title_link: response.items[0].link,
      },
    ];
  }

  static getSuccessMessage(attachments: MessageAttachment[]): BotMessage {
    return {
      ...SlackHelpers.defaultMessage,
      response_type: 'in_channel',
      attachments,
      text: 'Here you go',
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