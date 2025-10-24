import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, HydratedDocument } from "mongoose";
import { User } from "./user.model";


@Schema({
    timestamps:true,
})
export class Token {
    @Prop({type:String,required:true,unique:true})
    jti:string

    @Prop({type:Number,required:true})
    expiresIn:number

    @Prop({type:Types.ObjectId,required:true,unique:true,ref:'User'})
    userId:Types.ObjectId
}
export const TokenSchema = SchemaFactory.createForClass(Token);
export type TokenDocument = HydratedDocument<Token>;
export const TokenModel=MongooseModule.forFeature([{name:Token.name,schema:TokenSchema}])