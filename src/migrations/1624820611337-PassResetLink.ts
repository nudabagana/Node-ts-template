import {MigrationInterface, QueryRunner} from "typeorm";

export class PassResetLink1624820611337 implements MigrationInterface {
    name = 'PassResetLink1624820611337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_reset_link" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "link" uuid NOT NULL, "expires" bigint NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2433643537b59c8de4d86d4e428" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_02becc9ce6c0dee8f390f9c9e8" ON "password_reset_link" ("link") `);
        await queryRunner.query(`CREATE TABLE "verification_code" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "code" integer NOT NULL, "expires" bigint NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d702c086da466e5d25974512d46" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9c5ed56de22b2dc89d9f4fbdd5" ON "verification_code" ("email") `);
        await queryRunner.query(`ALTER TABLE "web_user" ADD CONSTRAINT "UQ_26836e940e7e99cd0a681700da9" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "web_user" ADD CONSTRAINT "UQ_a2f8ce470dbeeb6f0aa64d6b8f5" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "web_user" DROP CONSTRAINT "UQ_a2f8ce470dbeeb6f0aa64d6b8f5"`);
        await queryRunner.query(`ALTER TABLE "web_user" DROP CONSTRAINT "UQ_26836e940e7e99cd0a681700da9"`);
        await queryRunner.query(`DROP INDEX "IDX_9c5ed56de22b2dc89d9f4fbdd5"`);
        await queryRunner.query(`DROP TABLE "verification_code"`);
        await queryRunner.query(`DROP INDEX "IDX_02becc9ce6c0dee8f390f9c9e8"`);
        await queryRunner.query(`DROP TABLE "password_reset_link"`);
    }

}
