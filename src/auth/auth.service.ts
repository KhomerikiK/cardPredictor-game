import { Injectable, HttpService } from "@nestjs/common";
import { AuthenticateDto } from "src/dto/authenticat.dto";
import { GameService } from "src/game/game.service";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class AuthService {
  protected readonly confirmationEndpoint = "/verifyToken";

  constructor(
    private readonly httpService: HttpService,
    private readonly gameService: GameService,
    protected readonly configService: ConfigService
  ) {}

  /**
   * Authenticates JWT with wallet service
   * @param request
   * @returns
   */
  async authenticate(request) {
    const access = await this.validateToken(request);
    if (access.status) {
      const userId = access.data.user_details.id;
      const activeGame = await this.gameService.getActiveSession(access);
      if (activeGame.status) {
        return activeGame;
      } else {
        return await this.gameService.createNewSession(access.data);
      }
    }
    return access;
  }

  /**
   * Validates token pass confirmation in header encrypted wyth secret key
   * @param request
   * @returns
   */
  async validateToken(request) {
    try {
      const authHeaders = request.headers.authorization;
      const jwt = authHeaders.replace("Bearer ", "");
      const encripted = await this.configService.encryptString(jwt);

      const headersRequest = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        confirmation: `${encripted}`
      };
      const apiUrl =
        this.configService.get("WALLET_SERVICE_URL") +
        this.confirmationEndpoint;
      const result = await this.httpService
        .post(apiUrl, {}, { headers: headersRequest })
        .toPromise();
      return result.data;
    } catch (error) {
      return { status: 0, data: error.message + "we" };
    }
  }
}
