import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ErrorResponseFormatter } from '@qaseh/modules/formatter';
import { Request, Response } from 'express';

/**
 * @class HttpExceptionFilter
 *
 * @description
 * A NestJS exception filter that catches HttpExceptions. It uses the ErrorResponseFormatter to format the response for
 * these exceptions. The filter is applied to the entire application and will catch any HttpException thrown from any part
 * of the application.
 *
 * @public
 *
 * @implements {ExceptionFilter}
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * @constructor
   *
   * @param {ErrorResponseFormatter} errorResponseFormatter - The ErrorResponseFormatter used to format the response for
   * HttpExceptions.
   */
  constructor(
    private readonly errorResponseFormatter: ErrorResponseFormatter,
  ) {}

  /**
   * @method catch
   *
   * @description
   * This method is called when an HttpException is caught by the filter. It formats the response using the ErrorResponseFormatter
   * and sends it to the client.
   *
   * @param {HttpException} exception - The caught HttpException.
   * @param {ArgumentsHost} host - The ArgumentsHost object which provides access to the request and response objects.
   *
   * @returns {Response} - The formatted response.
   */
  catch(exception: HttpException, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return response.status(exception.getStatus()).json(
      this.errorResponseFormatter.format({
        req: request,
        error: exception.getResponse()['error'],
        message: exception.getResponse()['message'],
        status: exception.getStatus(),
      }),
    );
  }
}
