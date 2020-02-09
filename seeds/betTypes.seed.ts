import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { BetTypeEntity } from '../src/entities/betType.entity'
 
export default class BetTypesSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    
    await connection
      .createQueryBuilder()
      .insert()
      .into(BetTypeEntity)
      .values([
        { label: 'HIGH'}, 
        { label: 'LOW'}, 
      ])
      .execute()
  }
}