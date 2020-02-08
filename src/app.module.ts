import { Module, HttpModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database.module';
import * as path from 'path';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { GameService } from './services/game.service';
import { testm } from './middlewares/testm.middleware';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { AccessTokenService } from './access-token/access-token.service';


@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      configDir: path.resolve(__dirname, '..', 'config'),
    }),
    DatabaseModule.forRoot(),

    PassportModule,
    HttpModule,

    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },//TODO::should be placed in db
    }),
  ],
 
  
  controllers: [AppController],
  providers: [AuthService, GameService, JwtStrategy, AccessTokenService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(testm)
      .forRoutes({ path: 'authenticate', method: RequestMethod.POST });
  }
}
