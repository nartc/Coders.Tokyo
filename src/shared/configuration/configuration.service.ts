import { Injectable } from '@nestjs/common';
import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import { number, object, ObjectSchema, string, validate } from 'joi';
import { ConfigKey } from './configuration.enum';

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigurationService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = parse(readFileSync(filePath));
    this.envConfig = this.validateConfig(config);
  }

  private validateConfig(config: EnvConfig): EnvConfig {
    const envVarSchema: ObjectSchema = object({
      NODE_ENV: string()
        .valid(['development', 'production'])
        .default('development'),
      PORT: number().default(3000),
      GG_SEARCH_API_KEY: string(),
      GG_SEARCH_SO_CX: string(),
      GG_SEARCH_MDN_CX: string(),
      GG_SEARCH_W3S_CX: string(),
    });

    const { error, value: validatedConfig } = validate(config, envVarSchema);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedConfig;
  }

  get(key: ConfigKey): string {
    return this.envConfig[key];
  }

  get port(): number {
    return Number(this.envConfig[ConfigKey.PORT]);
  }

  get isDevelopment(): boolean {
    return this.envConfig[ConfigKey.NODE_ENV] === 'development';
  }
}
