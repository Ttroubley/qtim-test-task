import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  @IsDate()
  published_at: Date;
}
