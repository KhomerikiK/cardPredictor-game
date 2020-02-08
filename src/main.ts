require("dotenv").config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors();

  await app.listen(
    config.get("APP_PORT", 3000),
    config.get("APP_HOST", "localhost")
  );
}

bootstrap();
