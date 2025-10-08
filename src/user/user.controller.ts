import { Controller, Get } from "@nestjs/common";
import { UserService } from './user.service';
import { IUser } from "src/common";



@Controller('user')
export class UseController{
constructor(private readonly userService:UserService){}

@Get()
allUsers():{message:string,data:{users:IUser[]}}{
    const users:IUser[]=this.userService.allUsers()
    return {message:'done',data:{users}}
}
}