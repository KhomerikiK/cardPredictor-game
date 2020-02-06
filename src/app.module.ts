import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database.module';
import { TestController } from './test/test.controller';
import { TestService } from './test/test.service';
import * as path from 'path';


@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      configDir: path.resolve(__dirname, '..', 'config'),
    }),
    DatabaseModule.forRoot(),
  ],
 
  controllers: [TestController],
  providers: [TestService],
})
export class AppModule {}
