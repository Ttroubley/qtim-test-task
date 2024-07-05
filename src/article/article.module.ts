import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entity/article.entity';
import { CacheService } from 'src/cache/cache.service';
import { RedisModule } from 'src/db/redis/redis.module';

@Module({
  providers: [ArticleService, CacheService],
  controllers: [ArticleController],
  imports: [TypeOrmModule.forFeature([ArticleEntity]), RedisModule],
})
export class ArticleModule {}
