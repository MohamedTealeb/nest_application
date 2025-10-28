import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from 'src/DB/repository/category.repository';
import { BrandRepository } from 'src/DB/repository/brand.repository';
import { BrandModel } from 'src/DB/model/brand.model';
import { CategoryModel } from 'src/DB/model/category.model';

@Module({
  imports: [BrandModel,CategoryModel],
  controllers: [CategoryController ],
  providers: [CategoryService ,BrandRepository,CategoryRepository],
})
export class CategoryModule {}
