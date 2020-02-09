import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { StatusEntity } from '../src/entities/status.entity'
 
export default class StatusesSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(StatusEntity)
      .values([
        { label: 'PENDING'}, 
        { label: 'IN_PROGRESS'}, 
        { label: 'WIN'}, 
        { label:"LOSE" }
      ])
      .execute()
      
  }
}