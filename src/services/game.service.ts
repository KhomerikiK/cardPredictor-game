import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/entities/game.entity';
import { Repository } from 'typeorm';
import { StatusEntity } from 'src/entities/status.entity';
import { StartGameDto } from 'src/dto/startGame.dto';
import { AccessTokenService } from 'src/access-token/access-token.service';
import { CardService } from 'src/card/card.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    protected readonly gameRepository: Repository<GameEntity>,

    @InjectRepository(StatusEntity)
    protected readonly statusRepository: Repository<StatusEntity>,

    @InjectRepository(StatusEntity)
    protected readonly betTypeRepository: Repository<StatusEntity>,

    protected readonly accesstokenService: AccessTokenService,

    protected readonly cardService: CardService
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
      const pendingType = await this.getPendingStatus();
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
  async startGame(accessToken, amount){

    var game = accessToken.game;
    const inprogressStatus = await this.getInprogressStatus();
    game.amount = amount;
    game.status = inprogressStatus;
    await game.save()
    console.log(inprogressStatus);
    
    return await this.cardService.generate('USER', game);


  }
  


  async getInprogressStatus(){
    return this.statusRepository.findOne({where:{label:'IN_PROGRESS'}})
  }

  async getPendingStatus(){
    return this.statusRepository.findOne({where:{label:'PENDING'}})
  }
}