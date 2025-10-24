import {  MiddlewareConsumer, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PreAuth } from "src/common/middleware/authentication.middleware";
import { UserModel } from "src/DB/model/user.model";
import { TokenModel } from "src/DB/model/token.model";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import type  {Request} from 'express';
import {randomUUID} from 'node:crypto'


@Module({
    imports:[UserModel,TokenModel ,MulterModule.register({
        storage:diskStorage({
            destination(req:Request,file:Express.Multer.File,callback:Function){
                callback(null,'./uploads')

            },
            filename(req:Request,file:Express.Multer.File,callback:Function){
            const fileName=randomUUID() + '_'+Date.now()+'_'+file.originalname;
                callback(null,fileName)

            }
        })
    })],
    exports:[],
    controllers:[UserController],
    providers:[UserService,],
})
export class UserModule {
    configure(consumer:MiddlewareConsumer){



        consumer.apply(PreAuth).forRoutes(UserController)

    }
    // configure(consumer:MiddlewareConsumer){
    //     consumer.apply(setDefaultLanguage,authenticationMiddleware).forRoutes({path:'user/profile',method:RequestMethod.GET})
    // }
}