import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { succesResponse } from 'src/common/utils/response';
import { User } from 'src/common/decoretors/credential.decorator';
import type { UserDocument } from 'src/DB/model/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidation } from 'src/common/utils/multer/validation.multer';
import { IResponse } from 'src/common/interfaces/response.interfae';
import { BrandResponse } from './entities/brand.entity';
import { RoleEnum } from 'src/common/enums/user.enum';
import { Auth } from 'src/common/decoretors/auth.decoretors';
import { endpoint } from './authorization.module';
import { localFileUpload } from 'src/common/utils/multer/local.multer';
import type { IMulterFile } from 'src/common/interfaces/multer.interface';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  
  @UseInterceptors(FileInterceptor('attachment',localFileUpload({folder:'brands',vaildation:FileValidation.image})))
  @Auth(endpoint.create)
  @Post()
  async create(
    @User() user:UserDocument,
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile(ParseFilePipe)  file:IMulterFile
  ):Promise<IResponse<BrandResponse>> {
    const brand= await this.brandService.create(createBrandDto,file,user);
    return succesResponse <BrandResponse>({
      data:{brand},
      message:"Brand created successfully",
      status:201
    })
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
