import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { ConfigService } from "./config/config.service";
import entities from "./entities";

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const imports = [
      TypeOrmModule.forRootAsync({
        useFactory: (config: ConfigService) => ({
          entities,
          synchronize: false,
          type: "mysql",
          logging: false,
          database: config.get("DB_NAME"),
          username: config.get("DB_USER"),
          password: config.get("DB_PASSWORD"),
          host: config.get("DB_HOST"),
          port: config.getNumber("DB_PORT"),
          namingStrategy: new SnakeNamingStrategy()
        }),
        inject: [ConfigService]
      }),
      TypeOrmModule.forFeature(entities)
    ];

    return {
      imports,
      exports: imports,
      module: DatabaseModule
    };
  }
}
