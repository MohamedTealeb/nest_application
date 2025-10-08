import { Module } from '@nestjs/common';
import { CatrgoryService } from './catrgory.service';
import { CatrgoryController } from './catrgory.controller';

@Module({
  providers: [CatrgoryService],
  controllers: [CatrgoryController]
})
export class CatrgoryModule {}
