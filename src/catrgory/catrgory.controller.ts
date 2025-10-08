import { Controller, Get } from '@nestjs/common';
import { CatrgoryService } from './catrgory.service';

@Controller('catrgory')
export class CatrgoryController {
constructor(private readonly catrgoryService:CatrgoryService){}
    @Get()
    categories(){
        const categories=this.catrgoryService.categories()
        return {
            message:"done",
            data:{
                categories
            }
        }
    }
}
