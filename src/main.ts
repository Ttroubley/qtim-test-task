import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dataSource } from './db/datasource';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.forRoot(dataSource));
  await dataSource.runMigrations();
  await app.listen(3000);
}
bootstrap();
