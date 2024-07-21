import { Global, Module } from '@nestjs/common';
import { SuccessResponseFormatter } from './providers/formatters/success-response.formatter';
import { ErrorResponseFormatter } from './providers/formatters/error-response.formatter';

/**
 * @class FormatterModule
 *
 * @description
 * A NestJS module that provides formatters for different types of responses. It includes the SuccessResponseFormatter and
 * ErrorResponseFormatter, which are used to format successful and error responses respectively.
 *
 * @public
 */
@Global()
@Module({
  providers: [SuccessResponseFormatter, ErrorResponseFormatter],
  exports: [SuccessResponseFormatter, ErrorResponseFormatter],
})
export class FormatterModule {}
