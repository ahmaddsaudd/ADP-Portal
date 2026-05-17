import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778968621570 implements MigrationInterface {
    name = 'Migration1778968621570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adp_scheme_comments" DROP COLUMN "commented_by"`);
        await queryRunner.query(`ALTER TABLE "adp_scheme_comments" ADD "commented_by" character varying(150)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adp_scheme_comments" DROP COLUMN "commented_by"`);
        await queryRunner.query(`ALTER TABLE "adp_scheme_comments" ADD "commented_by" uuid`);
    }

}
