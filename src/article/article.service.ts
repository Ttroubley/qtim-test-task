import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './entity/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { CacheService } from '../cache/cache.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FindAllResponse } from './interfaces/find-all-response.interface';
import { FindAllParams } from './interfaces/find-all-query.interface';

@Injectable()
export class ArticleService {
  private readonly PAGE_LIMIT = 10;

  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async findAll(params: FindAllParams): Promise<FindAllResponse> {
    const {page = 1, author, publicationDate} = params
    const cacheKey = this.getCacheKey(page, author, publicationDate);
    const cached = await this.cacheService.get<FindAllResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    const query = this.buildQuery(author, publicationDate);
    const totalItems = await query.getCount();
    const totalPages = Math.ceil(totalItems / this.PAGE_LIMIT);

    const data = await query
      .skip((page - 1) * this.PAGE_LIMIT)
      .take(this.PAGE_LIMIT)
      .getMany();

    const result = { data, currentPage: Number(page), totalPages };

    await this.cacheService.set(cacheKey, result, 600);

    return result;
  }

  public buildQuery(author?: string, publicationDate?: string) {
    const query = this.articleRepository.createQueryBuilder('article');

    if (author) {
      query.andWhere('article.author = :author', { author });
    }

    if (publicationDate) {
      query.andWhere('article.published_at = :publicationDate', {
        publicationDate,
      });
    }

    return query;
  }

  public async findOne(id: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneBy({ id });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.BAD_REQUEST);
    }

    return article;
  }

  public async create(createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    await this.cacheService.clear('articles-page-*');
    const article = this.articleRepository.create(createArticleDto);
    return this.articleRepository.save(article);
  }

  public async update(id: string, updateArticleDto: UpdateArticleDto) {
    await this.cacheService.clear('articles-page-*');
    const res = await this.articleRepository.update(id, updateArticleDto);

    if (!res.affected) {
      throw new HttpException('Nothing was updated', HttpStatus.BAD_REQUEST);
    }

    return;
  }

  public async remove(id: string): Promise<void> {
    await this.cacheService.clear('articles-page-*');
    const res = await this.articleRepository.delete(id);

    if (!res.affected) {
      throw new HttpException('Nothing was deleted', HttpStatus.BAD_REQUEST);
    }

    return;
  }

  private getCacheKey(page: number, author?: string, publicationDate?: string): string {
    return `articles-page-${page}-author-${author || ''}-published_at-${publicationDate || ''}`;
  }
}
