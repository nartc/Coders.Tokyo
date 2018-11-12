import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { SlackHelpers } from '../../shared/utils/slack-helpers';
import { SlackUnauthorizedException } from './slack-unauthorized-exception';

@Catch(SlackUnauthorizedException)
export class SlackUnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.UNAUTHORIZED).json(
      SlackHelpers.getErrorResponse(exception),
    );
  }
}