import {  Injectable } from "@nestjs/common";
import { IUser } from "src/common";
import { RoleEnum } from "src/common/enums/user.enum";
import { S3Service } from "src/common/utils/security/s3.services";
import { UserDocument, User } from "src/DB/model/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class UserService {
    constructor(
        private readonly s3Service:S3Service,
        @InjectModel(User.name) private readonly userModel:Model<UserDocument>
    ){}


async    profileImage(file:Express.Multer.File,user:any):Promise<string>{
        // Extract user ID from JWT token - for regular login tokens, ID is in 'sub' field
        const userId = user.sub || user.id || user._id || user.userId;
        
        // Fetch the actual user document from database using the user ID from token
        const userDocument = await this.userModel.findById(userId);
        if (!userDocument) {
            throw new Error('User not found');
        }
        
        userDocument.profilePicture=await this.s3Service.uploadFile({
            file,
            path:`users/${userDocument._id.toString()}`
        })
        await userDocument.save()
        return userDocument.profilePicture


    }
}