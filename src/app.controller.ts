import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth/auth.service";
import { AuthenticateDto } from "./dto/authenticat.dto";
import { GameService } from "./game/game.service";
import { AccessTokenService } from "./access-token/access-token.service";

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly gameService: GameService,
    private readonly accessTokenService: AccessTokenService
  ) {}

  @Post("authenticate")
  async authenticate(@Request() authDto: AuthenticateDto) {
    return await this.authService.authenticate(authDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("startGame")
  async startGame(@Request() req) {
    const auth = req.headers.authorization;
    const jwt = auth.replace("Bearer ", "");
    const accessToken = await this.accessTokenService.getByToken(jwt);
    
    if (typeof accessToken == "undefined") {
      throw new UnauthorizedException();
    }
    if (accessToken.expiredAt != null) {
      throw new UnauthorizedException();
    }

    if (accessToken.game.status.label != "PENDING") {
      return { status: 0, data: "stage has finished" };
    }
    return await this.gameService.startGame(accessToken, req.body.amount);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("endGame")
  async endGame(@Request() req) {
    const auth = req.headers.authorization;
    const jwt = auth.replace("Bearer ", "");
    const accessToken = await this.accessTokenService.getByToken(jwt);

    if (typeof accessToken == "undefined") {
      throw new UnauthorizedException();
    }

    if (accessToken.expiredAt != null) {
      throw new UnauthorizedException();
    }
    if (accessToken.game.status.label != "IN_PROGRESS") {
      return { status: 0, data: "stage has finished" };
    }
    return await this.gameService.endGame(
      accessToken,
      req.body.prediction.toUpperCase()
    );
  }
}
