import { BaseEntity } from "./base.entity";
import { PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, Entity, OneToMany } from "typeorm";
import { StatusEntity } from "./status.entity";
import { AccessTokenEntity } from "./accessToken.entity";
import { CardEntity } from "./card.entity";

@Entity('games')
export class GameEntity extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  public walletAccessToken: string;

  @Column({
    type: 'varchar',
  })
  public token: string;

  @Column({
    type: 'decimal',
  })
  public betAmount: number;

  @Column({
    type: 'int',
  })
  public userId: number;

  @Column({
    type: 'int',
  })
  public statusId: number;

  @OneToOne(
    () => StatusEntity,
    status => status.game,
  )
  @JoinColumn({
      name: 'status_id',
  })
  public status: StatusEntity;

  @Column({
    type: 'timestamp',
    name: 'finished_at',
  })
  public finishedAt: Date;

  /**
  * relation with user
  */
  @OneToMany(
    () => AccessTokenEntity,
    accessToken => accessToken.game,
  )
  public accessToken: AccessTokenEntity;


    /**
  * relation with user
  */
 @OneToMany(
  () => CardEntity,
    card => card.game,
  )
  public card: CardEntity;
}
