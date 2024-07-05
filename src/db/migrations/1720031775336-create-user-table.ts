import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1720031775336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
              "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              "username" VARCHAR(255) NOT NULL,
              "password" VARCHAR(255) NOT NULL
            )
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "users"
      `);
  }
}
