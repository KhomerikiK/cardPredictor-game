import {MigrationInterface, QueryRunner} from "typeorm";

export class dbMigrations1581237487232 implements MigrationInterface {
    name = 'dbMigrations1581237487232'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `statuses` (`id` int NOT NULL AUTO_INCREMENT, `created_at` timestamp NOT NULL, `label` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `card_types` (`id` int NOT NULL AUTO_INCREMENT, `created_at` timestamp NOT NULL, `label` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `cards` (`id` int NOT NULL AUTO_INCREMENT, `created_at` timestamp NOT NULL, `value` int NOT NULL, `card_type_id` int NOT NULL, `game_id` int NOT NULL, INDEX `REL_010040e63b2b829e9303596463` (`card_type_id`), INDEX `REL_6afce8ac3bc3f66e8acbe87b43` (`game_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `games` (`id` int NOT NULL AUTO_INCREMENT, `created_at` timestamp NOT NULL, `wallet_access_token` varchar(255) NOT NULL, `token` varchar(255) NOT NULL, `bet_amount` decimal NOT NULL, `user_id` int NOT NULL, `status_id` int NOT NULL, `finished_at` timestamp NULL DEFAULT null, INDEX `REL_0708b7e9a570b2e1b8ba580730` (`status_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `access_tokens` (`id` int NOT NULL AUTO_INCREMENT, `created_at` timestamp NOT NULL, `token` varchar(255) NOT NULL, `expired_at` timestamp NULL DEFAULT null, `game_id` int NULL, INDEX `REL_aa83551f1ea55fc9ae8ab9cc7c` (`game_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `bet_types` (`id` int NOT NULL AUTO_INCREMENT, `created_at` timestamp NOT NULL, `label` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `cards` ADD CONSTRAINT `FK_010040e63b2b829e93035964636` FOREIGN KEY (`card_type_id`) REFERENCES `card_types`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `cards` ADD CONSTRAINT `FK_6afce8ac3bc3f66e8acbe87b43f` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `games` ADD CONSTRAINT `FK_0708b7e9a570b2e1b8ba5807302` FOREIGN KEY (`status_id`) REFERENCES `statuses`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `access_tokens` ADD CONSTRAINT `FK_aa83551f1ea55fc9ae8ab9cc7cf` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `access_tokens` DROP FOREIGN KEY `FK_aa83551f1ea55fc9ae8ab9cc7cf`", undefined);
        await queryRunner.query("ALTER TABLE `games` DROP FOREIGN KEY `FK_0708b7e9a570b2e1b8ba5807302`", undefined);
        await queryRunner.query("ALTER TABLE `cards` DROP FOREIGN KEY `FK_6afce8ac3bc3f66e8acbe87b43f`", undefined);
        await queryRunner.query("ALTER TABLE `cards` DROP FOREIGN KEY `FK_010040e63b2b829e93035964636`", undefined);
        await queryRunner.query("DROP TABLE `bet_types`", undefined);
        await queryRunner.query("DROP INDEX `REL_aa83551f1ea55fc9ae8ab9cc7c` ON `access_tokens`", undefined);
        await queryRunner.query("DROP TABLE `access_tokens`", undefined);
        await queryRunner.query("DROP INDEX `REL_0708b7e9a570b2e1b8ba580730` ON `games`", undefined);
        await queryRunner.query("DROP TABLE `games`", undefined);
        await queryRunner.query("DROP INDEX `REL_6afce8ac3bc3f66e8acbe87b43` ON `cards`", undefined);
        await queryRunner.query("DROP INDEX `REL_010040e63b2b829e9303596463` ON `cards`", undefined);
        await queryRunner.query("DROP TABLE `cards`", undefined);
        await queryRunner.query("DROP TABLE `card_types`", undefined);
        await queryRunner.query("DROP TABLE `statuses`", undefined);
    }

}
