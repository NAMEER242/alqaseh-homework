import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ErrorResponse, ResponseFormatter } from './response.formatter';

/**
 * @interface Response
 *
 * @description
 * An interface that represents the structure of an error response object. This object contains various properties that
 * provide information about the error response.
 */
interface Response {
  req: Request;
  error?: string | object;
  message?: string;
  status: number;
}

/**
 * @class ErrorResponseFormatter
 *
 * @description
 * A class that extends the ResponseFormatter base class to format error responses. It provides methods to format different
 * parts of the response such as error, message, status, and extra.
 *
 * @public
 *
 * @extends {ResponseFormatter}
 */
@Injectable()
export class ErrorResponseFormatter extends ResponseFormatter {
  /**
   * @method format
   *
   * @description
   * Formats the entire response object into an ErrorResponse object.
   *
   * @param {Response} response - The response object that needs to be formatted.
   *
   * @returns {ErrorResponse} - The formatted ErrorResponse object.
   */
  public format(response: Response): ErrorResponse {
    return {
      error: response.error,
      message: this.formatMessage(response.message),
      status: this.formatStatus(response.status),
      extra: this.formatExtra(response.req),
    };
  }
}
