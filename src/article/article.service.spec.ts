import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { ArticleService } from './article.service';
import { ArticleEntity } from './entity/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CacheService } from '../cache/cache.service';
import { dataSource } from '../db/datasource';

describe('ArticleService', () => {
  let service: ArticleService;
  let repository: Repository<ArticleEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            await dataSource.initialize();
            return dataSource.options;
          },
        }),
        TypeOrmModule.forFeature([ArticleEntity]),
      ],
      providers: [
        ArticleService,
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            clear: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    repository = module.get<Repository<ArticleEntity>>(
      getRepositoryToken(ArticleEntity),
    );
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM articles`);
  });

  afterAll(async () => {
    await repository.query(`DELETE FROM articles`);
  });

  describe('create', () => {
    it('should create an article', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Test Article',
        description: 'This is a test article.',
        published_at: new Date(),
        author: 'John Doe',
      };

      const createdArticle = await service.create(createArticleDto);
      expect(createdArticle).toHaveProperty('id');
      expect(createdArticle.title).toEqual(createArticleDto.title);
      expect(createdArticle.description).toEqual(createArticleDto.description);
      expect(createdArticle.author).toEqual(createArticleDto.author);
    });
  });

  describe('findOne', () => {
    it('should find an article by id', async () => {
      const article: ArticleEntity = repository.create({
        title: 'Found Article',
        description: 'This article should be found.',
        published_at: new Date(),
        author: 'Jane Doe',
      });

      await repository.save(article);

      const foundArticle = await service.findOne(article.id);
      expect(foundArticle).toBeDefined();
      expect(foundArticle.id).toEqual(article.id);
      expect(foundArticle.title).toEqual(article.title);
    });

    it('should throw an error if article not found', async () => {
      await expect(service.findOne('non_existing_id')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update an existing article', async () => {
      const article: ArticleEntity = repository.create({
        title: 'Update Article',
        description: 'This article will be updated.',
        published_at: new Date(),
        author: 'John Doe',
      });

      await repository.save(article);

      const updateDto: UpdateArticleDto = {
        title: 'Updated Article',
      };

      await service.update(article.id, updateDto);

      const updatedArticle = await repository.findOneBy({ id: article.id });
      expect(updatedArticle).toBeDefined();
      expect(updatedArticle.title).toEqual(updateDto.title);
    });

    it('should throw an error if article not found', async () => {
      const updateDto: Partial<CreateArticleDto> = {
        title: 'Updated Article',
      };

      await expect(
        service.update('non_existing_id', updateDto),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove an existing article', async () => {
      const article = new ArticleEntity();
      article.title = 'Delete Article';
      article.description = 'This article will be deleted.';
      article.published_at = new Date();
      article.author = 'Jane Doe';

      await repository.save(article);

      await service.remove(article.id);

      const deletedArticle = await repository.findOneBy({ id: article.id });
      expect(deletedArticle).toBeNull();
    });

    it('should throw an error if article not found', async () => {
      await expect(service.remove('non_existing_id')).rejects.toThrow();
    });
  });
});
