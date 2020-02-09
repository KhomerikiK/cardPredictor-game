import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameEntity } from "src/entities/game.entity";
import { Repository } from "typeorm";
import { StatusEntity } from "src/entities/status.entity";
import { AccessTokenService } from "src/access-token/access-token.service";
import { CardService } from "src/card/card.service";
import { AccessTokenEntity } from "src/entities/accessToken.entity";
import { BetTypeEntity } from "src/entities/betType.entity";
import { TransactionService } from "src/transaction/transaction.service";
var crypto = require("crypto");

@Injectable()
export class GameService {
  protected compareOperators = {
    HIGH: function(a, b) {
      return a > b;
    },
    LOW: function(a, b) {
      return a < b;
    }
  };

  protected readonly depositEndpoint = "/deposit";
  protected readonly WithdrawEndpoint = "/withdraw";
  protected readonly logOutEndpoint = "/logOut";

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

  /**
   * check if exists active session of the game on current user
   * if doesnt exists return back
   * if exists but token expired refresh token
   * @param userId
   */
  async getActiveSession(access) {
    console.log('getActiveSession');
    
    const activeGame = await this.gameRepository.findOne({
      where: {
        finishedAt: null,
        userId: access.data.user_details.id
      },
      relations: ["status"]
    });

    console.log('activeGame');

    if (typeof activeGame == "undefined") {
      return { status: 0, data: "There is no Active game sessions" };
    }
    var activeToken = await this.accesstokenService.getActiveToken(
      activeGame.id
    );
    console.log('activeToken');

    if (typeof activeToken == "undefined") {
      console.log('undefined');

      activeToken = await this.accesstokenService.createNew(activeGame);
      console.log('createNew');

    }else{
      console.log('refreshToken');
      
      activeToken = await this.accesstokenService.refreshToken(activeToken);
      console.log('refreshToken2');

      
    }
    

    activeGame.walletAccessToken = access.data.access_token;
    await activeGame.save();
    console.log('saved');
    
    return {
      status: 1,
      data: {
        game: activeGame,
        token: activeToken
      }
    };

 
  }

  /**
   * create new session of the game
   * @param userId
   */
  async createNewSession(access: any) {
    try {
      const pendingType = await this.getPendingStatus();
      const user = access.user_details;
      var game = new GameEntity();
      var token = crypto.randomBytes(20).toString("hex");

      game.walletAccessToken = access.access_token;
      game.userId = user.id;
      game.status = pendingType;
      game.createdAt = new Date();
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
      };
    } catch (error) {
      return { status: 0, data: error.message };
    }
  }

  /**
   * start of the game
   * bet the amoun
   * change game status
   * refresh the token
   * generate random card and asign to the game
   * @param accessToken
   * @param amount
   */
  async startGame(accessToken: AccessTokenEntity, amount: number) {
    var game = accessToken.game;
    const inprogressStatus = await this.getInprogressStatus();
    game.betAmount = amount;
    game.status = inprogressStatus;
    await game.save();
    const refreshToken = await this.accesstokenService.refreshToken(
      accessToken
    );
    const generatedCard = await this.cardService.generate("USER", game);
    return {
      status: 1,
      data: {
        bet_mount: amount,
        game_status: game.status,
        card_value: generatedCard.value,
        game_access_token: refreshToken.token
      }
    };
  }

  /**
   * final stage of the game
   * @param accessToken
   * @param prediction
   */
  async endGame(accessToken: AccessTokenEntity, prediction: string) {
    var wonAmount = 0;
    var lostAmount = 0;
    var game = accessToken.game;

    const userCardValue = game.card[0].value;
    const systemCard = await this.cardService.generate("SYSTEM", game);
    const result = this.compareOperators[prediction](
      userCardValue,
      systemCard.value
    );

    var gameFromDb = await this.gameRepository.findOne({where:{id:game.id}});

    /* withdrow amount form users wallet */
    const witdrawStatus = await this.transactionService._post(
      game.walletAccessToken,
      { amount: game.betAmount },
      this.WithdrawEndpoint
    );

    var newAccessToken = witdrawStatus.data.access_token;
    /* if money charged successfully */
    if (witdrawStatus.status) {
      /* if user won the game */
      if (result) {
        const status = await this.getWinStatuse();
        gameFromDb.status = status;
        wonAmount = game.betAmount * 2;
        const depositStatus = await this.transactionService._post(
          game.walletAccessToken,
          { amount: wonAmount },
          this.depositEndpoint
        );
        newAccessToken = depositStatus.data.access_token;
      } else {
        lostAmount = game.betAmount;
        const status = await this.getLoseStatuse();
        gameFromDb.statusId = status.id;
      }

      const now = new Date();
      gameFromDb.finishedAt = now;
      await gameFromDb.save();

      await this.transactionService._post(
        newAccessToken,
        {},
        this.logOutEndpoint
      );
      return {
        status: 1,
        data: {
          bet_mount: game.betAmount,
          won_amount: wonAmount,
          lost_amount: lostAmount,
          game_status: game.status,
          card_value: systemCard.value
        }
      };
    }
    return witdrawStatus;
  }

  

  /**
   * Gets inprogress status
   * @returns  statusRepository
   */
  async getInprogressStatus() {
    return this.statusRepository.findOne({ where: { label: "IN_PROGRESS" } });
  }

  /**
   * Gets pending status
   * @returns  statusRepository
   */
  async getPendingStatus() {
    return this.statusRepository.findOne({ where: { label: "PENDING" } });
  }

  /**
   * Gets win statuse
   * @returns  statusRepository
   */
  async getWinStatuse() {
    return this.statusRepository.findOne({ where: { label: "WIN" } });
  }

  /**
   * Gets lose statuse
   * @returns  statusRepository
   */
  async getLoseStatuse() {
    return this.statusRepository.findOne({ where: { label: "LOSE" } });
  }
}
