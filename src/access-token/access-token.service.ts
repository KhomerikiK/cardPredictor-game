import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccessTokenEntity } from "src/entities/accessToken.entity";
import { GameEntity } from "src/entities/game.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class AccessTokenService {
  constructor(
    @InjectRepository(AccessTokenEntity)
    protected readonly accessTokenRepository: Repository<AccessTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * @param token: string
   * @param user: UserEntity
   * @return token
   * */
  async store(token: string, game: GameEntity) {
    var accessToken = new AccessTokenEntity();
    accessToken.game = game;
    accessToken.token = token;
    await accessToken.save();
    return accessToken;
  }

  /**
   * @param token: string
   * @return AccessTokenEntity
   * */
  async getByToken(token: string) {
    return await this.accessTokenRepository.findOne({
      relations: ["game", "game.status", "game.card", "game.card.type"],
      where: { token: token }
    });
  }

  /**
   * @param user_id: number
   * @return AccessTokenEntity
   * */
  async getActiveToken(game_id: number) {
    let activeToke = await this.accessTokenRepository.findOne({
      where: {
        expiredAt: null,
        game_id: game_id
      },
      relations: ["game", "game.status", "game.card", "game.card.type"]
    });
    let result = typeof activeToke != "undefined";
    return { exists: result, accessToken: activeToke };
  }

  /**
   * @param accessToken: AccessTokenEntity
   * @return void
   * */
  async expire(accessToken: AccessTokenEntity) {
    const now = new Date();
    accessToken.expiredAt = now; //fill expire_at field to detect if expired
    await accessToken.save();
  }

  /**
   * @param accessToken: AccessTokenEntity
   * @return AccessTokenEntity
   * */
  async refreshToken(accessToken: AccessTokenEntity) {
    await this.expire(accessToken); //expire the old accessToken
    console.log("expired");

    const payload = {
      token: accessToken.game.token,
      id: accessToken.game.id
    };
    const token = this.jwtService.sign(payload);
    const newAccessToken = this.store(token, accessToken.game); //store just generated token
    return newAccessToken;
  }

  /**
   * @param accessToken: AccessTokenEntity
   * @return AccessTokenEntity
   * */
  async createNew(game: GameEntity) {
    const payload = {
      token: game.token,
      id: game.id
    };
    const token = this.jwtService.sign(payload);
    const newAccessToken = this.store(token, game); //store just generated token
    return newAccessToken;
  }
}
