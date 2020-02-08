import { BaseEntity } from "./base.entity";
import { PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { GameEntity } from "./game.entity";

export class BetCondition extends BaseEntity {

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
      public game: GameEntity;
}
