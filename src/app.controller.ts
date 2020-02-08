import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { AuthenticateDto } from './dto/authenticat.dto';
import { StartGameDto } from './dto/startGame.dto';
import { EndGameDto } from './dto/endGame.dto';
import { GameService } from './services/game.service';

@Controller()
export class AppController {
    constructor(
      private readonly authService: AuthService,
      private readonly gameService: GameService
    )
    {}

    @Post('authenticate')
    async login(@Request() authDto: AuthenticateDto) {        
        return await this.authService.authenticate(authDto);
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('startGame')
    async startGame(@Request() req) {        
        return await this.gameService.startGame(req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('endGame')
    async endGame(@Request() endgameDto: EndGameDto ) {        
        return ;
    }

  
}