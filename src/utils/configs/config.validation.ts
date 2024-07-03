import { plainToClass } from 'class-transformer';
import {
  IsDefined,
  IsNumberString,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  PORT: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  DB_URL: string;
}

export function validateEnvironment(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, {
    skipMissingProperties: false,
  });

  let index = 0;

  for (const error of errors) {
    Object.values(error.constraints).map((str) => {
      ++index;
      console.error(`Error ${index}: ${str}`);
    });
    console.error('\n ***** \n');
  }

  if (errors.length) {
    throw new Error('Config validation error');
  }
  return finalConfig;
}
