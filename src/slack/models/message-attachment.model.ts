import { AttachmentField } from './attachment-field.model';

export class MessageAttachment {
  fallback: string;
  text?: string;
  pretext?: string;
  mrkdwn?: boolean;
  fields?: AttachmentField[];
  ts?: number;
  footer?: string;
  footer_icon?: string;
  author_name?: string;
  author_link?: string;
  author_icon?: string;
  color?: string;
  title?: string;
  title_link?: string;
  thumb_url?: string;
}
