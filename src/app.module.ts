import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as path from 'path';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersService } from './users/users.service';
import { AppController } from './app.controller';


@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      configDir: path.resolve(__dirname, '..', 'config'),
    }),
    DatabaseModule.forRoot(),
    AuthModule,
    UsersModule,
    
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
 
  controllers: [AppController],
  providers: [UsersService],
})
export class AppModule {}
