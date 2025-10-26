import { Controller, Get, Headers, Patch, Req, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from './user.service';
import { IUser } from "src/common";
import  type{ Request } from "express";
import { AuthenticationGuard } from "src/common/guards/authentication/authentication.guard";
import { AuthorizationGuard } from "src/common/guards/authorization/authorization.guard";
import { RoleEnum } from "src/common/enums/user.enum";
import { Roles } from "src/common/decoretors/role.decorator";
import { Auth } from "src/common/decoretors/auth.decoretors";
import { tokenName } from "src/common/decoretors/tokenType.decorator";
import { TokenEnum } from "src/common/enums/token.enums";
import type { UserDocument } from "src/DB/model/user.model";
import { User } from "src/common/decoretors/credential.decorator";
import { PreferredLanguageInterceptor } from "src/common/interceptors/applyLanguage.interceptors";
import { delay, Observable, of } from "rxjs";
import { FileInterceptor } from "@nestjs/platform-express";
import type { IAuthRequest } from "src/common/interfaces/token.interface";




@Controller('user')
export class UserController{
    constructor(private readonly userService:UserService){}
    
    
    // // @UseInterceptors(PreferredLanguageInterceptor)
    // @SetMetadata('tokenType',TokenEnum.ACCESS)
    // @UseGuards(AuthenticationGuard,AuthorizationGuard)
    @UseInterceptors(PreferredLanguageInterceptor)

    @Auth([RoleEnum.USER,  RoleEnum.ADMIN],TokenEnum.ACCESS)
@Get('profile')
profile( @Req() req:IAuthRequest,   @User() user:any ):{message:string}{
    return {message:'done'}
}


@Get()
allUsers():{message:string,data:{users:IUser[]}}{
    const users:IUser[]=this.userService.allUsers()
    return {message:'done',data:{users}}
}

@UseInterceptors(FileInterceptor('profileImage'))
@Auth([RoleEnum.USER])
@Patch('profileImage')
profileImage(
    @UploadedFile() file:Express.Multer.File,
){
    console.log(file);
    return {message:'done'}
}
}