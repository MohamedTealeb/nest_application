import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { IUser } from "src/common";
import { IBrand } from "src/common/interfaces/brand.interface";



@Schema({
    timestamps:true,
})
export class Brand implements IBrand {

    @Prop({type:String,required:true,unique:true,minLength:2,maxLength:26})
    name:string
    @Prop({type:String,minLength:2,maxLength:50})
    slug:string
    @Prop({type:String,required:true,minLength:2,maxLength:26})
    slogan:string
    @Prop({type:String,required:true})
    image:string
    @Prop({type:Types.ObjectId,required:true,ref:"User"})
    createdBy:Types.ObjectId | IUser
    @Prop({type:Types.ObjectId,ref:"User"})
    updatedBy:Types.ObjectId | IUser

}
export type BrandDocument = HydratedDocument<Brand>;
const brandSchema = SchemaFactory.createForClass(Brand);

brandSchema.pre('save',async function(next){

  if(this.isModified('name')){

this.slug=slugify(this.name)
next()

}})
export const BrandModel=MongooseModule.forFeature([{name:Brand.name,schema:brandSchema}])