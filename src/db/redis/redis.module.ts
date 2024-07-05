import { Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    NestRedisModule.forRoot({
      config: {
        host: 'redis',
        port: 6379,
      },
    }),
  ],
  exports: [NestRedisModule],
})
export class RedisModule {}
