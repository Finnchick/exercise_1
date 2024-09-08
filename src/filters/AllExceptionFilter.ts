import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    if (exception instanceof HttpException) {
      const httpStatus = exception.getStatus();

      this.logger.error(exception.message, exception.stack);

      const responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message: exception.message,
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    } else if (exception instanceof Error) {
      this.logger.error(
        exception.message,
        exception.stack,
        'AllExceptionFilter',
      );

      const responseBody = {
        message: exception.message,
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, 500);
    } else {
      this.logger.error(exception);

      const responseBody = {
        message: 'Internal server error blin',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, 500);
    }
  }
}
