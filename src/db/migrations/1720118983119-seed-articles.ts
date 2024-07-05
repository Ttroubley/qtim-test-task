import { MigrationInterface, QueryRunner } from 'typeorm';
import { ArticleEntity } from 'src/article/entity/article.entity';
import { faker } from '@faker-js/faker';

export class SeedArticleRecords1720118983119 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const articleRepository = queryRunner.manager.getRepository(ArticleEntity);

    const articles = Array.from({ length: 25 }).map(() =>
      articleRepository.create({
        title: faker.lorem.words(5),
        description: faker.lorem.sentences(3),
        author: faker.name.fullName(),
        published_at: faker.date.past(),
      }),
    );

    await articleRepository.save(articles);
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
