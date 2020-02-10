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
import { RedisService } from "nestjs-redis";

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
    protected readonly transactionService: TransactionService,
    protected readonly redisService: RedisService
  ) {}

  async checkActiveState(userId) {
    const activeGame = await this.gameRepository.findOne({
      where: {
        finishedAt: null,
        userId: userId
      },
      relations: ["status", "accessToken"]
    });
    let result = typeof activeGame != "undefined";
    return { exists: result, game: activeGame };
  }

  async refreshGameToken(game) {
    var activeToken = await this.accesstokenService.getActiveToken(game.id);

    if (activeToken.exists) {
      var refreshToken = await this.accesstokenService.refreshToken(
        activeToken.accessToken
      );
      return { status: 1, data: refreshToken };
    }
    return { status: 0, data: activeToken };
  }

  /**
   * create new session of the game
   * @param userId
   */
  async createNewSession(access: any) {
    try {
      var game = new GameEntity();
      let redisClient = this.redisService.getClient();
      const pendingType = await this.getPendingStatus();
      const user = access.user_details;
      var token = crypto.randomBytes(20).toString("hex");
      /* 
      store users balance to the redis 
      storage to use it another moments 
      */
      await redisClient.set(
        token,
        user.balance,
        "ex",
        86400
      );

      game.walletAccessToken = access.access_token;
      game.userId = user.id;
      game.betAmount = 0;
      game.status = pendingType;
      game.createdAt = new Date();
      game.token = token;
      await game.save();// create new game object
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
    let redisClient = this.redisService.getClient();
    var game = accessToken.game;

    const refreshToken = await this.accesstokenService.refreshToken(
      accessToken
    );

    const userBalance = await redisClient.get(game.token);
    /* check user has enough balance */
    if (parseFloat(userBalance) < amount) {
      return {
        status: 0,
        data: {
          message: "Insufficient funds on balance",
          bet_mount: amount,
          user_available_balance: userBalance,
          game_status: game.status,
          game_access_token: refreshToken.token
        }
      };
    }
    const inprogressStatus = await this.getInprogressStatus();
    game.betAmount = amount;
    game.status = inprogressStatus;
    await game.save();//save users updated fields
    /* generate user random card */
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
    /* use associated array to determine game winner by the bet type */
    const result = this.compareOperators[prediction](
      userCardValue,
      systemCard.value
    );

    var gameFromDb = await this.gameRepository.findOne({
      where: { id: game.id }
    });

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
        gameFromDb.status = status;
      }

      /* 
        fill finished_at field, it means that game is finished
        fill expired at field on token it means token is expired and can never be used
      */
      const now = new Date();
      gameFromDb.finishedAt = now;
      accessToken.expiredAt = now;
      await accessToken.save();
      await gameFromDb.save();

      /* post on specified route to log out wallet session on token */
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
          game_status: gameFromDb.status,
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
