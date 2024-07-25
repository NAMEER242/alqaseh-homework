import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1721930262237 implements MigrationInterface {
    name = 'InitialMigration1721930262237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`customers\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`full_name\` tinytext NOT NULL, \`image_url\` varchar(255) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int UNSIGNED NULL, UNIQUE INDEX \`REL_11d81cd7be87b6f8865b0cf766\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admins\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`full_name\` tinytext NOT NULL, \`image_url\` varchar(255) NULL, \`is_superuser\` tinyint NOT NULL DEFAULT 0, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int UNSIGNED NULL, UNIQUE INDEX \`REL_2b901dd818a2a6486994d915a6\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` int UNSIGNED NOT NULL, \`quantity\` int UNSIGNED NOT NULL, \`category\` enum ('Furniture', 'Electronics', 'Beauty', 'Garden') NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_by\` int UNSIGNED NULL, \`updated_by\` int UNSIGNED NULL, UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`discounts\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`total_price_limit\` int UNSIGNED NOT NULL, \`value\` int UNSIGNED NOT NULL DEFAULT '0', \`is_used\` tinyint NOT NULL DEFAULT 0, \`code\` varchar(255) NOT NULL, \`expired_at\` timestamp NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8c7cc2340e9ea0fc5a246e6374\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`order_price\` int UNSIGNED NOT NULL, \`payment_method\` enum ('xyzWallet', 'credit') NOT NULL, \`purchased_at\` timestamp NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`discount_id\` int UNSIGNED NULL, \`customer_id\` int UNSIGNED NULL, UNIQUE INDEX \`REL_555d48c77395dc43554c7067ed\` (\`discount_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders_products\` (\`ordersId\` int UNSIGNED NOT NULL, \`productsId\` int UNSIGNED NOT NULL, INDEX \`IDX_3c896321873d00008a0590bf46\` (\`ordersId\`), INDEX \`IDX_c5da576f0342e179fd678c9427\` (\`productsId\`), PRIMARY KEY (\`ordersId\`, \`productsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_11d81cd7be87b6f8865b0cf7661\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`admins\` ADD CONSTRAINT \`FK_2b901dd818a2a6486994d915a68\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_c1af9b47239151e255f62e03247\` FOREIGN KEY (\`created_by\`) REFERENCES \`admins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_4b9f1600a4f721ac017eefb03ee\` FOREIGN KEY (\`updated_by\`) REFERENCES \`admins\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_555d48c77395dc43554c7067ed6\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_772d0ce0473ac2ccfa26060dbe9\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` ADD CONSTRAINT \`FK_3c896321873d00008a0590bf46b\` FOREIGN KEY (\`ordersId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orders_products\` ADD CONSTRAINT \`FK_c5da576f0342e179fd678c94276\` FOREIGN KEY (\`productsId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders_products\` DROP FOREIGN KEY \`FK_c5da576f0342e179fd678c94276\``);
        await queryRunner.query(`ALTER TABLE \`orders_products\` DROP FOREIGN KEY \`FK_3c896321873d00008a0590bf46b\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_772d0ce0473ac2ccfa26060dbe9\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_555d48c77395dc43554c7067ed6\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_4b9f1600a4f721ac017eefb03ee\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_c1af9b47239151e255f62e03247\``);
        await queryRunner.query(`ALTER TABLE \`admins\` DROP FOREIGN KEY \`FK_2b901dd818a2a6486994d915a68\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_11d81cd7be87b6f8865b0cf7661\``);
        await queryRunner.query(`DROP INDEX \`IDX_c5da576f0342e179fd678c9427\` ON \`orders_products\``);
        await queryRunner.query(`DROP INDEX \`IDX_3c896321873d00008a0590bf46\` ON \`orders_products\``);
        await queryRunner.query(`DROP TABLE \`orders_products\``);
        await queryRunner.query(`DROP INDEX \`REL_555d48c77395dc43554c7067ed\` ON \`orders\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP INDEX \`IDX_8c7cc2340e9ea0fc5a246e6374\` ON \`discounts\``);
        await queryRunner.query(`DROP TABLE \`discounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP INDEX \`REL_2b901dd818a2a6486994d915a6\` ON \`admins\``);
        await queryRunner.query(`DROP TABLE \`admins\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_11d81cd7be87b6f8865b0cf766\` ON \`customers\``);
        await queryRunner.query(`DROP TABLE \`customers\``);
    }

}
