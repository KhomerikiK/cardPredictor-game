import {
  Module,
  HttpModule,
  MiddlewareConsumer,
  RequestMethod
} from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database.module";
import * as path from "path";
import { AppController } from "./app.controller";
import { AuthService } from "./auth/auth.service";
import { GameService } from "./game/game.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./auth/jwt.strategy";
import { AccessTokenService } from "./access-token/access-token.service";
import { CardService } from "./card/card.service";
import { TransactionService } from "./transaction/transaction.service";

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      configDir: path.resolve(__dirname, "..", "config")
    }),
    DatabaseModule.forRoot(),
    PassportModule,
    HttpModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1d" } //TODO::should be placed in db
    })
  ],

  controllers: [AppController],
  providers: [
    AuthService,
    GameService,
    JwtStrategy,
    AccessTokenService,
    CardService,
    CardService,
    TransactionService
  ]
})
export class AppModule {}
