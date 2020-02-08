import { BaseEntity } from "./base.entity";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from "typeorm";
import { GameEntity } from "./game.entity";

@Entity('statuses')
export class StatusEntity extends BaseEntity {

  @Column({
    type: 'varchar',
  })
  public lable: string;

  /**
  * relation with transactions
  */
  @OneToMany(
    () => GameEntity,
    game => game.status
  )
  public game: GameEntity
}
