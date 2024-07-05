import { ArticleEntity } from '../article/entity/article.entity';
import { UserEntity } from '../user/entity/user.entity';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'qTimTestDb',
  entities: [ArticleEntity, UserEntity],
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
  migrationsTableName: 'migrations',
});
