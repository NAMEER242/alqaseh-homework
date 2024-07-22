import { Request } from 'express';
import { HttpStatus } from '@nestjs/common';

/**
 * @interface IMeta
 *
 * @description
 * An interface that represents the metadata for a response. It includes properties for pagination such as the number of
 * items per page, the current page, the total number of items, and the total number of pages.
 */
export interface IMeta {
  take: number;
  page: number;
  itemsCount: number;
  pagesCount: number;
}

/**
 * @interface IStatus
 *
 * @description
 * An interface that represents the status of a response. It includes properties for the HTTP status code and the corresponding
 * status name.
 */
export interface IStatus {
  code: number;
  name: string;
}

/**
 * @interface IExtra
 *
 * @description
 * An interface that represents additional information for a response. It includes properties for the timestamp of the response
 * and the path of the request.
 */
export interface IExtra {
  timestamp: string;
  path: string;
}

/**
 * @interface SuccessResponse
 *
 * @description
 * An interface that represents a successful response. It includes properties for the data returned, the metadata, the message,
 * the status, and any additional information.
 */
export interface SuccessResponse {
  data: object | object[];
  meta: IMeta;
  message: string;
  status: IStatus;
  extra: IExtra;
}

/**
 * @interface ErrorResponse
 *
 * @description
 * An interface that represents an error response. It includes properties for the error returned, the message, the status,
 * and any additional information.
 */
export interface ErrorResponse {
  error: string | object;
  message: string;
  status: IStatus;
  extra: IExtra;
}

/**
 * @class ResponseFormatter
 *
 * @description
 * An abstract class that provides a base for creating response formatter classes. These formatter classes are used to format
 * the response data, status, and extra information. The class provides methods to format a message, a status, and extra information.
 *
 * @public
 *
 * @abstract
 */
export abstract class ResponseFormatter {
  /**
   * @method formatMeta
   *
   * @description
   * Formats the meta part of the response. It calculates the number of pages based on the items count and the take value.
   *
   * @param {Request} req - The request object from which the page and take values are extracted.
   * @param {number} itemsCount - The total number of items.
   *
   * @returns {IMeta} - The formatted meta object.
   *
   * @throws {Error} - Throws an error if the page or take query params are not found in the request.
   */
  protected formatMeta(req: Request, itemsCount: number): IMeta {
    if (!itemsCount) {
      return;
    }

    if (!req.query.limit) {
      const message = `Query param 'limit' is not found in request ${req.method} ${req.path}`;
      throw new Error(message);
    }

    if (!req.query.page) {
      const message = `Query param 'page' is not found in request ${req.method} ${req.path}`;
      throw new Error(message);
    }

    const take = Number(req.query.limit);
    const page = Number(req.query.page);

    return {
      take: take,
      page: page,
      itemsCount: itemsCount,
      pagesCount: Math.ceil(itemsCount / take),
    };
  }

  /**
   * @method formatMessage
   *
   * @description
   * Formats a message.
   *
   * @param {string} message - The message that needs to be formatted.
   *
   * @returns {string} - The formatted message.
   */
  protected formatMessage(message: string): string {
    return message;
  }

  /**
   * @method formatStatus
   *
   * @description
   * Formats a status. It returns an object with the HTTP status code and the corresponding status name.
   *
   * @param {number} status - The status that needs to be formatted.
   *
   * @returns {IStatus} - The formatted status.
   */
  protected formatStatus(status: number): IStatus {
    return {
      code: status,
      name: HttpStatus[status],
    };
  }

  /**
   * @method formatExtra
   *
   * @description
   * Formats extra information. It returns an object with the request URL and the current timestamp.
   *
   * @param {Request} req - The request from which the extra information is extracted.
   *
   * @returns {IExtra} - The formatted extra information.
   */
  protected formatExtra(req: Request): IExtra {
    return {
      path: req.url,
      timestamp: new Date().toJSON(),
    };
  }
}
