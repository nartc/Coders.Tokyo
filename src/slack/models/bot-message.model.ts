import { MessageAttachment } from './message-attachment.model';

export class BotMessage {
  text?: string;
  attachments?: MessageAttachment[];
  thread_ts?: string;
  response_type?: 'ephemeral' | 'in_channel';
  replace_original?: boolean;
  delete_original?: boolean;
}
