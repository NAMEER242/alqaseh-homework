import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ResponseFormatter, SuccessResponse } from './response.formatter';

/**
 * @interface Response
 *
 * @description
 * An interface that represents the structure of a success response object. This object contains various properties that
 * provide information about the success response.
 */
interface Response {
  req: Request;
  data?: object | object[];
  count?: number;
  message?: string;
  status: number;
}

/**
 * @class SuccessResponseFormatter
 *
 * @description
 * A class that extends the ResponseFormatter base class to format successful responses. It provides methods to format different
 * parts of the response such as data, meta, message, status, and extra.
 *
 * @public
 *
 * @extends {ResponseFormatter}
 */
@Injectable()
export class SuccessResponseFormatter extends ResponseFormatter {
  /**
   * @method format
   *
   * @description
   * Formats the entire response object into a SuccessResponse object.
   *
   * @param {Response} response - The response object that needs to be formatted.
   *
   * @returns {SuccessResponse} - The formatted SuccessResponse object.
   */
  public format(response: Response): SuccessResponse {
    return {
      data: response.data,
      meta: this.formatMeta(response.req, response.count),
      message: this.formatMessage(response.message),
      status: this.formatStatus(response.status),
      extra: this.formatExtra(response.req),
    };
  }
}
