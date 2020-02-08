import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/entities/game.entity';
import { Repository } from 'typeorm';
import { StatusEntity } from 'src/entities/status.entity';
import { StartGameDto } from 'src/dto/startGame.dto';
import { AccessTokenService } from 'src/access-token/access-token.service';
import { CardService } from 'src/card/card.service';
import { AccessTokenEntity } from 'src/entities/accessToken.entity';
import { BetTypeEntity } from 'src/entities/betType.entity';
import { accessSync } from 'fs';
import { TransactionService } from 'src/transaction/transaction.service';
var crypto = require("crypto");


@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    protected readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(StatusEntity)
    protected readonly statusRepository: Repository<StatusEntity>,
    @InjectRepository(StatusEntity)
    protected readonly betTypeRepository: Repository<BetTypeEntity>,
    protected readonly accesstokenService: AccessTokenService,
    protected readonly cardService: CardService,
    protected readonly transactionService: TransactionService
  ) {}

  protected compareOperators = {
    'HIGH': function(a, b) { return a < b },
    'LOW': function(a, b) { return a > b },
  };

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
      const user =  access.user_details;
      var game = new GameEntity();
      console.log('here');
      var token = crypto.randomBytes(20).toString('hex');

      game.walletAccessToken = access.access_token;
      game.userId = user.id;
      game.status = pendingType;
      game.token = token;
      await game.save();
      
      const accessToken = await this.accesstokenService.createNew(game);
      return { 
        status: 1, 
        data: {
          user_email: user.email,
          user_balance: user.balance,
          game_token: game.token, 
          game_status: game.status, 
          game_service_access_token: accessToken.token
        }
      }  
    } catch (error) {
      return {status:0, data:error.message}
    }
    
  }

  /*  */
  async startGame(accessToken:AccessTokenEntity, amount:number){
    
    var game = accessToken.game;
    const inprogressStatus = await this.getInprogressStatus();
    game.betAmount = amount;
    game.status = inprogressStatus;
    await game.save()
    const refreshToken = await this.accesstokenService.refreshToken(accessToken);
    const generatedCard =  await this.cardService.generate('USER', game);
    return {
      status:1,
      data:{
        bet_mount: amount,
        game_status: game.status,
        card_value: generatedCard.value,
        game_access_token: refreshToken.token
      }
    }


  }

  async endGame(accessToken:AccessTokenEntity, prediction:string){
    
    
    var game = accessToken.game;
    const userCardValue = game.card[0].valeu;
    const systemCard = await this.cardService.generate('USER', game);
    const result = this.compareOperators[prediction](userCardValue, systemCard.value)
    
    if (result) {
      const status = await this.getWinStatuse();
      game.status = status;
      const wonAmount = game.betAmount * 2;
      await this.transactionService._post(game.walletAccessToken, {amount: wonAmount}, '/withdraw')

    }else{
      const status = await this.getLoseStatuse();
      game.status = status;
    }
    const now = new Date();
    game.finishedAt = now;
    game.save();
    return {
      status:1,
      data:{
        bet_mount: game.betAmount,
        game_status: game.status,
        card_value: systemCard.value,
      }
    }
  }
  

  async getInprogressStatus(){
    return this.statusRepository.findOne({where:{label:'IN_PROGRESS'}})
  }

  async getPendingStatus(){
    return this.statusRepository.findOne({where:{label:'PENDING'}})
  }

  async getWinStatuse(){
    return this.statusRepository.findOne({where:{label:'WIN'}})
  }

  async getLoseStatuse(){
    return this.statusRepository.findOne({where:{label:'LOSE'}})
  }
}