import { BaseEntity } from "./base.entity";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from "typeorm";
import { GameEntity } from "./game.entity";
import { CardEntity } from "./card.entity";

@Entity("card_types")
export class CardTypeEntity extends BaseEntity {
  @Column({
    type: "varchar"
  })
  public label: string;

  /**
   * relation with transactions
   */
  @OneToMany(
    () => CardEntity,
    card => card.type
  )
  public card: CardEntity;
}
