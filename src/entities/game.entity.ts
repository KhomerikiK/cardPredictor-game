import { BaseEntity } from "./base.entity";
import { PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";
import { StatusEntity } from "./status.entity";

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

  @OneToOne(
    () => StatusEntity,
    transactionType => transactionType.game,
)
  @JoinColumn({
      name: 'status_id',
  })
  public status: StatusEntity;
}
