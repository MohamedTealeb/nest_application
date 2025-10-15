import { Injectable } from "@nestjs/common";
import { OtpDocument as TDocument ,Otp } from "../model/otp.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./database.repository";



@Injectable()

export class OtpRepository extends DataBaseRepository<TDocument>{
constructor(@InjectModel (Otp.name)  readonly model:Model<TDocument>,){
    super(model)
}



}