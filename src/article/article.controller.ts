import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleService } from './article.service';
import { ArticleEntity } from './entity/article.entity';
import { FindAllParams } from './interfaces/find-all-query.interface';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FindAllResponse } from './interfaces/find-all-response.interface';
import { IdParamDto } from './dto/id-param.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articlesService: ArticleService) {}

  @Get()
  async findAll(@Query() query: FindAllParams): Promise<FindAllResponse> {
    
    return this.articlesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') params: IdParamDto): Promise<ArticleEntity> {
    return this.articlesService.findOne(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    return this.articlesService.create(createArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') params: IdParamDto,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(params.id, updateArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') params: IdParamDto): Promise<void> {
    return this.articlesService.remove(params.id);
  }
}
