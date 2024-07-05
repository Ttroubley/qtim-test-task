import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticleTable1720031696830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "articles" (
              "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              "title" VARCHAR(255) NOT NULL,
              "description" TEXT NOT NULL,
              "author" VARCHAR(255) NOT NULL,
              "published_at" DATE NOT NULL
            )
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "articles"
      `);
  }
}
