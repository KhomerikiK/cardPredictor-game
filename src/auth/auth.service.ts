import { Injectable, HttpService } from '@nestjs/common';
import { AuthenticateDto } from 'src/dto/authenticat.dto';
import { GameService } from 'src/game/game.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly gameService: GameService,
  ) {}

  async authenticate(request){
    const access = await this.validateToken(request);
    if (access.status) {
      
      const userId = access.data.user_details.id;
      const activeGame = await this.gameService.getActiveSession(userId);
      if (activeGame.status) {
        return activeGame
      }else{        
        return await this.gameService.createNewSession(access.data);
      }
    }
    return access
  }

  async validateToken(request){
    try {
      const authHeaders = request.headers.authorization
      const jwt = authHeaders.replace('Bearer ', '');
      const headersRequest = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      };
      //TODO::dinmic
      const apiUrl = 'http://localhost:3000/verifyToken';
      const result = await this.httpService.post(apiUrl, {}, { headers: headersRequest }).toPromise();
      console.log(result.data);

      return result.data
      
    } catch (error) {
        return {status:0, data:error.message}
    }
  }
  
}