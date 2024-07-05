import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CacheService } from './cache/cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class AppModule {
  static forRoot(dataSource: DataSource): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ArticleModule,
        UserModule,
        AuthModule,
        CacheModule.register({
          ttl: 600,
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            await dataSource.initialize();
            return dataSource.options;
          },
        }),
      ],
      controllers: [AppController],
      providers: [AppService, CacheService],
    };
  }
}
