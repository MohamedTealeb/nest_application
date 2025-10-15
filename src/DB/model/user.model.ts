import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { GenderEnum, ProviderEnum } from "src/common/enums/user.enum";
import { generateHash } from "src/common/utils/security/hash.security";
import { OtpDocument } from "./otp.model";


@Schema({
    strictQuery:true,
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
})
export class User {
    @Prop({type:String,minlength:2,maxlength:26,trim:true})
    firstName: string;
    @Prop({type:String,minlength:2,maxlength:26,trim:true})
    lastName: string;
    @Virtual({
        get:function(this:User){
            return `${this.firstName} ${this.lastName}`
        },
        set:function(value:string){
            const[firstName,lastName]=value.split(' ')||[]
            this.set({firstName,lastName})
        }
    })
    username:string


    @Prop({
        type:String,
        required:true,
        unique:true,
    })
    email:string


    @Prop({type:String,required:function(this:User){
        return this.provider===ProviderEnum.GOOGLE ? false : true
    }})
    password:string;

    @Prop({type:String,enum:ProviderEnum,default:ProviderEnum.SYSTEM})
   provider:ProviderEnum; 

    @Prop({type:String,enum:GenderEnum,default:GenderEnum.male})
   gender:GenderEnum;
  @Prop({type:Date ,required:false})
   confirmEmail:Date

   @Prop({type:Date,required:false})
   changeCredentials:Date;

   @Prop({type:String,required:false})
   confrimEmailOtp?:string;
   @Prop({type:Date,required:false})
   confirmEmailAt:Date;

   @Prop({type:String,required:false})
   resetPasswordOtp?:string;
   @Prop({type:Date,required:false})
   resetPasswordAt?:Date;

   @Prop({type:String,required:false})
   profileImage?:string;

   @Virtual()
   otp:OtpDocument[]

}
const userSchema=SchemaFactory.createForClass(User)
userSchema.virtual("otp",{
    ref:"Otp",
    localField:"_id",
    foreignField:"createdBy",
})
userSchema.pre('save',async function(next){
if(this.isModified('password')) {
    this.password=await generateHash(this.password)
}
next()

})

export type UserDocument=HydratedDocument<User>
export const UserModel=MongooseModule.forFeature([{name:User.name,schema:userSchema}])