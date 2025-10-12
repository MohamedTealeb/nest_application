import { Types } from "mongoose";

export interface IToken{
    jwy:string,
    expiresIn:string,
    userId:Types.ObjectId
}
