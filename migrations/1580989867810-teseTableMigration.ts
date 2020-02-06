import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey, Table, TableIndex} from "typeorm";

export class teseTableMigration1580989867810 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "question",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar",
                }
            ]
        }), true)        
        
        await queryRunner.createIndex("question", new TableIndex({
            name: "IDX_QUESTION_NAME",
            columnNames: ["name"]
        }));
        
        await queryRunner.createTable(new Table({
            name: "answer",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar",
                }
            ]
        }), true);
        
        await queryRunner.addColumn("answer", new TableColumn({
            name: "questionId", 
            type: "int" 
        }));
        
        await queryRunner.createForeignKey("answer", new TableForeignKey({
            columnNames: ["questionId"],
            referencedColumnNames: ["id"],
            referencedTableName: "question",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
