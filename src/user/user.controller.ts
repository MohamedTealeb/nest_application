import { Controller, Get, Headers, Req, UseGuards, UseInterceptors } from "@nestjs/common";
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




@Controller('user')
export class UserController{
constructor(private readonly userService:UserService){}


@UseInterceptors(PreferredLanguageInterceptor)
@Auth([RoleEnum.ADMIN,RoleEnum.USER])

@Get('profile')
profile( @Headers() header:any,   @User() user:UserDocument ):Observable<any>{
    return of([{message:'done'}]).pipe(delay(10000))
}


@Get()
allUsers():{message:string,data:{users:IUser[]}}{
    const users:IUser[]=this.userService.allUsers()
    return {message:'done',data:{users}}
}
}