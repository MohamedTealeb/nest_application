import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandRepository } from 'src/DB/repository/brand.repository';
import { UserDocument } from 'src/DB/model/user.model';
import { BrandDocument } from 'src/DB/model/brand.model';
import { IMulterFile } from 'src/common/interfaces/multer.interface';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository){}
  async create(createBrandDto: CreateBrandDto,file:IMulterFile,user:UserDocument):Promise<BrandDocument> {
    const{name,slogan}=createBrandDto;
    const checkBrand=await this.brandRepository.findOne({filter:{name}});
    if(checkBrand){
      throw new ConflictException('Brand already exists');
    }
    
    // Use the finalPath from multer configuration for local file upload
    const image:string = file ? `/${file.finalPath}` : '';
    
    const brand=await this.brandRepository.create({
      data:{
        name,
        slogan,
        image,
        createdBy:user._id,
      },
    });
    if(!brand){
      throw new BadRequestException('Failed to create brand');
    }
    return brand;
  }

  findAll() {
    return `This action returns all brand`;
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
