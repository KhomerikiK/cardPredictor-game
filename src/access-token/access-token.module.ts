import { Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenEntity } from 'src/entities';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([AccessTokenEntity])
    ],
})
export class AccessTokenModule {
    
  providers: [JwtService]
}
