import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./database.repository";
import { IToken  as TDocument } from "src/common/interfaces/token.interface";
import { Token } from "../model/token.model";
import { Model } from "mongoose";



export class TokenRepository extends DataBaseRepository<TDocument>{
    constructor(@InjectModel(Token.name) protected override readonly model:Model<TDocument>){
        super(model)
    }
}