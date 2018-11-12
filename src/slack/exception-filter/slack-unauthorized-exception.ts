import { UnauthorizedException } from '@nestjs/common';

export class SlackUnauthorizedException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
