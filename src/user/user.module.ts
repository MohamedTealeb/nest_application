import {  MiddlewareConsumer, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthenticationMiddleware } from "src/common/middleware/authentication.middleware";
import { UserModel } from "src/DB/model/user.model";
import { TokenModel } from "src/DB/model/token.model";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import type  {Request} from 'express';
import {randomUUID} from 'node:crypto'
import { TokenSecurity } from "src/common/utils/security/token.security";
import { AuthenticationGuard } from "src/common/guards/authentication/authentication.guard";


@Module({
    imports:[
        UserModel,
        TokenModel,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'default-secret',
            signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600') },
        }),
        MulterModule.register({
            storage:diskStorage({
                destination(req:Request,file:Express.Multer.File,callback:Function){
                    callback(null,'./uploads')

                },
                filename(req:Request,file:Express.Multer.File,callback:Function){
                const fileName=randomUUID() + '_'+Date.now()+'_'+file.originalname;
                    callback(null,fileName)

                }
            })
        })
    ],
    exports:[],
    controllers:[UserController],
    providers:[UserService,TokenSecurity,AuthenticationMiddleware,AuthenticationGuard],
})
export class UserModule {
    configure(consumer:MiddlewareConsumer){



        // consumer.apply(AuthenticationMiddleware).forRoutes(UserController)

    }
    // configure(consumer:MiddlewareConsumer){
    //     consumer.apply(setDefaultLanguage,authenticationMiddleware).forRoutes({path:'user/profile',method:RequestMethod.GET})
    // }
}