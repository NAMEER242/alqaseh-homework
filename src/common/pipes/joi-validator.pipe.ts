/**
 * A custom NestJS pipe that uses Joi for input validation and transformation.
 */
import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class JoiValidatorPipe implements PipeTransform {
  /**
   * Constructs the pipe with a Joi schema.
   *
   * @param schema A Joi schema used for validation.
   */
  constructor(private readonly schema: any) {}

  /**
   * Validates and transforms the input using the provided Joi schema.
   *
   * @param value The input value to be validated.
   * @param metadata Additional metadata about the input.
   * @returns The validated and transformed value if validation passes.
   * @throws UnprocessableEntityException if validation fails.
   */
  transform(value: any, metadata: ArgumentMetadata) {
    // If the input is a route parameter, return it as is
    if (metadata.type === 'param') {
      return value;
    }

    // Validate the value using the provided Joi schema
    const { error, value: validatedValue } = this.schema.validate(value, {
      stripUnknown: true, // Used to remove unknown keys from the validated object.
      abortEarly: false, // Used to control the behavior of validation errors.
    });

    // If validation fails, throw an UnprocessableEntityException
    if (error) {
      const messages = {};
      error.details.forEach(
        (error: { context: { key: string | number }; message: any }) => {
          messages[error.context.key] = error.message;
        },
      );

      throw new UnprocessableEntityException({
        message: messages,
        error: 'Unprocessable Entity Exception',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    // Return the validated and transformed value
    return validatedValue;
  }
}
