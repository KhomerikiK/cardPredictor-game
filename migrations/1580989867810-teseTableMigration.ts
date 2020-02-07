import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey, Table, TableIndex} from "typeorm";

export class teseTableMigration1580989867810 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "email",
                    type: "varchar",
                }
            ]
        }), true)        
        
        await queryRunner.createIndex("users", new TableIndex({
            name: "IDX_QUESTION_NAME",
            columnNames: ["email"]
        }));
                
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
