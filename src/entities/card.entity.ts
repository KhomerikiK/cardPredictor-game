import { BaseEntity } from "./base.entity";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity, OneToOne, JoinColumn } from "typeorm";
import { GameEntity } from "./game.entity";
import { CardTypeEntity } from "./cardType.entity";

@Entity('cards')
export class CardEntity extends BaseEntity {

    @Column({
        type: 'int',
      })
      public value: number;
    
      @Column({
        type: 'int',
      })
      public cardTypeId: number;
    
      @OneToOne(
        () => CardTypeEntity,
        type => type.card,
      )
      @JoinColumn({
          name: 'card_type_id',
      })
      public type: CardTypeEntity;


      @OneToOne(
        () => GameEntity,
        game => game.card,
      )
      @JoinColumn({
          name: 'game_id',
      })
      public game: GameEntity;
}
