import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigService } from "./config.service";

export interface ConfigModuleOptions {
  /**
   * Json configuration files location
   */
  configDir?: string;
  /**
   * List of all available environments
   */
  environments?: string[];
}

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    const providers = [
      {
        provide: ConfigService,
        useValue: new ConfigService(options.configDir, options.environments)
      }
    ];

    return {
      providers,
      module: ConfigModule,
      exports: providers
    };
  }
}
