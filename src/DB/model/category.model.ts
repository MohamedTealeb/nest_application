

import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
import { IUser } from "src/common";
import { IBrand } from "src/common/interfaces/brand.interface";
import { ICategory } from "src/common/interfaces/category.interface";



@Schema({
    timestamps:true,
    strictQuery:true,
    strict:true
})
export class Category implements ICategory {

    @Prop({type:String,required:true,unique:true,minLength:2,maxLength:26})
    name:string
    @Prop({type:String,minLength:2,maxLength:50})
    slug:string
    @Prop({type:String,minLength:2,maxLength:5000})
    description:string
    @Prop({type:String,required:true})
    image:string
    @Prop({type:Types.ObjectId,required:true,ref:"User"})
    createdBy:Types.ObjectId | IUser
    @Prop({type:Types.ObjectId,ref:"User"})
    updatedBy:Types.ObjectId | IUser
    @Prop({type:Date})
    freezedAt?: Date 
    @Prop({type:Date})
    restoredAt?: Date 

    @Prop({type:String,required:true})
    assetFolderId:string
    @Prop({type:Types.ObjectId,ref:"Brand"})
    brands?: Types.ObjectId[] | IBrand[];

}
export type CategoryDocument = HydratedDocument<Category>;
const categorySchema = SchemaFactory.createForClass(Category);

categorySchema.pre('save',async function(next){

  if(this.isModified('name')){

this.slug=slugify(this.name)
next()

}})
categorySchema.pre(['findOneAndUpdate','updateOne'],async function(next){

  const update=this.getUpdate() as UpdateQuery<Category>
  if(update.name){
this.setUpdate({...update,slug:slugify(update.name)})
  }
  next()

})
categorySchema.pre(['findOne','find'],async function(next){

const query=this.getQuery();
if(query.paranoId===false){
  this.setQuery({...query})
}else{
  this.setQuery({...query,freezedAt:{$exists:false}})
}

  next()
})
export const CategoryModel=MongooseModule.forFeature([{name:Category.name,schema:categorySchema}])