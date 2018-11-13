import { createHmac, timingSafeEqual } from 'crypto';
import { stringify } from 'qs';
import { BotMessage, MessageAttachment, SlashCommandPayload } from '../../slack/models';
import { FALLBACK_STRING, FOOTER_STRING, SUCCESS_COLOR } from '../constants';
import { GoogleSearchResponse } from '../google-search';
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

  static getSuccessAttachment(response: GoogleSearchResponse): MessageAttachment[] {
    let text: string;

    if (response.items[0].pagemap.metatags) {
      text = response.items[0].pagemap.metatags[0]['og:description'];
    } else {
      text = response.items[0].snippet;
    }

    return [
      {
        fallback: FALLBACK_STRING,
        color: SUCCESS_COLOR,
        footer: FOOTER_STRING,
        text,
        title: response.items[0].title,
        title_link: response.items[0].link,
        thumb_url: response.items[0].pagemap.cse_thumbnail[0].src,
      },
    ];
  }

  static getSuccessMessage(attachments: MessageAttachment[]): BotMessage {
    return {
      ...SlackHelpers.defaultMessage,
      response_type: 'in_channel',
      attachments,
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