import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/entities/game.entity';
import { Repository } from 'typeorm';
import { StatusEntity } from 'src/entities/status.entity';
import { StartGameDto } from 'src/dto/startGame.dto';
import { AccessTokenService } from 'src/access-token/access-token.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    protected readonly gameRepository: Repository<GameEntity>,

    @InjectRepository(StatusEntity)
    protected readonly statusRepository: Repository<StatusEntity>,

    protected readonly accesstokenService: AccessTokenService
  ) {}

  /*  */
  async getActiveSession(userId){
    const activeGame = await this.gameRepository.findOne({
      where:{
        finishedAt: null,
        userId: userId
      },

      relations: ['status',],

    })
    if (typeof activeGame == 'undefined') {
      return {status: 0, data:'There is no Active game sessions'}
    }
    var activeToken = await this.accesstokenService.getActiveToken(activeGame.id)
    if (typeof activeToken == 'undefined') {
      activeToken = await this.accesstokenService.createNew(activeGame)
    }
    return { 
      status: 1, 
      data: {
        game: activeGame, 
        token: activeToken
      }
    }    
  }

  async createNewSession(access: any){
    try {
      const pendingType = await this.getPendingType();
      var game = new GameEntity();
      game.walletAccessToken = access.access_token;
      game.userId = access.user_details.id;
      game.status = pendingType;
      await game.save();
      
      const accessToken = await this.accesstokenService.createNew(game);
      return { 
        status: 1, 
        data: {
          game: game, 
          token: accessToken
        }
      }  
    } catch (error) {
      return {status:0, data:error.message}
    }
    
  }

  /*  */
  async startGame(startGameDto: StartGameDto){
    
  }
  
  async getInprogressType(){
    return this.statusRepository.findOne({where:{lable:'IN_PROGRESS'}})
  }

  async getPendingType(){
    return this.statusRepository.findOne({where:{lable:'PENDING'}})
  }
}