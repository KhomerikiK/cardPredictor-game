import {
  Column,
  PrimaryGeneratedColumn,
  BaseEntity as OrmBaseEntity
} from "typeorm";

export class BaseEntity extends OrmBaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: "timestamp",
    name: "created_at"
  })
  public createdAt: Date;

  public length: any;
}
