import { BaseEntity } from "./base.entity";
import {
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  Entity,
  OneToMany
} from "typeorm";
import { StatusEntity } from "./status.entity";
import { AccessTokenEntity } from "./accessToken.entity";
import { CardEntity } from "./card.entity";

@Entity("games")
export class GameEntity extends BaseEntity {
  @Column({
    name:"wallet_access_token",
    type: "varchar"
  })
  public walletAccessToken: string;

  @Column({
    type: "varchar"
  })
  public token: string;

  @Column({
    name:"bet_amount",
    type: "decimal"
  })
  public betAmount: number;

  @Column({
    name:"user_id",
    type: "int"
  })
  public userId: number;

  @Column({
    name:"status_id",
    type: "int"
  })
  public statusId: number;

  @OneToOne(
    () => StatusEntity,
    status => status.game
  )
  @JoinColumn({
    name: "status_id"
  })
  public status: StatusEntity;

  @Column({
    type: "timestamp",
    name: "finished_at",
    default: null
  })
  public finishedAt: Date;

  /**
   * relation with user
   */
  @OneToMany(
    () => AccessTokenEntity,
    accessToken => accessToken.game
  )
  public accessToken: AccessTokenEntity;

  /**
   * relation with user
   */
  @OneToMany(
    () => CardEntity,
    card => card.game
  )
  public card: CardEntity;
}
