import { BotMessage } from '../../slack/models';

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
}