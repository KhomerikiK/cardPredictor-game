import { Column, PrimaryGeneratedColumn, BaseEntity as OrmBaseEntity } from 'typeorm';

export class BaseEntity extends OrmBaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: new Date(),
  })
  public createdAt!: Date;

  @Column({
    type: 'timestamp',
    name: 'updated_at',
    default: new Date(),
  })
  public updatedAt!: Date;

  public length: any;
}
