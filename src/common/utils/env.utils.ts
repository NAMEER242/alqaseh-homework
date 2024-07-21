import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

/**
 * Represents the structure of environment variables.
 */
class EnvironmentVariables {
  /** The path to the application environment file. */
  @IsString()
  APP_ENV_PATH: string;

  /** The port on which the application will listen. */
  @IsNumber()
  APP_PORT: number;
}

/**
 * Validates and transforms the provided configuration object into an instance of EnvironmentVariables class.
 *
 * @param config The configuration object to validate and transform.
 * @returns An instance of EnvironmentVariables class.
 * @throws Error if validation fails.
 */
export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
