import type { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { UserDocument } from "src/DB/model/user.model";
import { TokenEnum } from "../enums/token.enums";

export interface IToken{
    jti:string,
    expiresIn:number,
    userId:Types.ObjectId
}
export interface ICredentials{ 
    user:UserDocument,
    decode:JwtPayload
}
export interface IAuthRequest extends Request {

    credentials:ICredentials;
    tokenType?:TokenEnum
}