import { Injectable, HttpService } from '@nestjs/common';
import { AuthenticateDto } from 'src/dto/authenticat.dto';
import { GameService } from 'src/services/game.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly gameService: GameService,
  ) {}

  async authenticate(request){

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
      return result.data
    } catch (error) {
        return {status:0, data:error.message}
      }
   
  }
  
}