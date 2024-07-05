import { ArticleEntity } from '../entity/article.entity';

export interface FindAllResponse {
  data: ArticleEntity[];
  currentPage: number;
  totalPages: number;
}
