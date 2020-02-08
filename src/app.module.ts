import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database.module';
import * as path from 'path';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';


@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      configDir: path.resolve(__dirname, '..', 'config'),
    }),
    DatabaseModule.forRoot(),

    
  ],
 
  
  controllers: [AppController],
  providers: [AuthService],
})
export class AppModule {}
