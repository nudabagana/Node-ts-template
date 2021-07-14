import {MigrationInterface, QueryRunner} from "typeorm";

export class initMigration1608163439225 implements MigrationInterface {
    name = 'initMigration1608163439225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "web_session" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "userId" integer NOT NULL, "expires" bigint NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a20f923225e2b0ea32d675dc9ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "web_user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "authorized" boolean NOT NULL, "email" character varying NOT NULL, "suspended" boolean NOT NULL, "admin" boolean NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6fd2787b14d397d531da0bee245" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "web_user"`);
        await queryRunner.query(`DROP TABLE "web_session"`);
    }

}
