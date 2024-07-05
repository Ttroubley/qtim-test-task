import { IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  author?: string;

  @IsOptional()
  publishedAt?: Date;
}
