import { Injectable } from "@nestjs/common";
import { IUser } from "src/common";



@Injectable()
export class AuthenticationService {
private users:IUser[]=[]
constructor(){}

signup(data:any){
    const id=Date.now()
    this.users.push({...data,id})
    return id
}


}