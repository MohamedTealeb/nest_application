import {  Injectable } from "@nestjs/common";
import { IUser } from "src/common";


@Injectable()
export class UserService {
    constructor(){}

    allUsers():IUser[]{
        return [{id:1,username:"mohamed",email:"mohamed@example.com",password:"123456",ConfirmPassword:"123456"}]
    }
}