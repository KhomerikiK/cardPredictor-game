import { BaseEntity } from "./base.entity";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from "typeorm";
import { GameEntity } from "./game.entity";

@Entity('bet_types')
export class BetTypeEntity extends BaseEntity {

    @Column({
        type: 'varchar',
      })
      public label: string;

      @Column({
        type: 'varchar',
      })
      public symbol: string;
      /**
      * relation with transactions
      */
      @OneToMany(
        () => GameEntity,
        game => game.status
      )
      public type: GameEntity;
}
