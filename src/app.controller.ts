import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { AuthenticateDto } from './dto/authenticat.dto';

@Controller()
export class AppController {
    constructor(
      private readonly authService: AuthService
    )
    {}

    @Post('authenticate')
    async login(@Request() authDto: AuthenticateDto) {        
        return await this.authService.authenticate(authDto);
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('verifyToken')
    verifyToken(@Request() req) {
      return req.user;
    }


    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
}