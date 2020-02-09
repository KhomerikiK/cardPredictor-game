import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { CardTypeEntity } from '../src/entities/cardType.entity'
 
export default class CardTypesSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CardTypeEntity)
      .values([{ label: 'USER'}, { label:"SYSTEM" }])
      .execute()
      
  }
}