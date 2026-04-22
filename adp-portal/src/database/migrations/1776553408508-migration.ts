import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1776553408508 implements MigrationInterface {
    name = 'Migration1776553408508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adp_scheme_documents" ADD "caption" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adp_scheme_documents" DROP COLUMN "caption"`);
    }

}
