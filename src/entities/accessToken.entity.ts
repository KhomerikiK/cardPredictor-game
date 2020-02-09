import { Column, Entity, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { GameEntity } from "./game.entity";

@Entity("access_tokens")
export class AccessTokenEntity extends BaseEntity {
  constructor() {
    super();
  }

  @Column({
    type: "varchar"
  })
  public token: string;

  @Column({
    type: "timestamp",
    name: "expired_at",
    default: null
  })
  public expiredAt: Date;

  @OneToOne(
    () => GameEntity,
    game => game.accessToken
  )
  @JoinColumn({
    name: "game_id"
  })
  public game: GameEntity;
}
