import {  MiddlewareConsumer, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PreAuth } from "src/common/middleware/authentication.middleware";
import { UserModel } from "src/DB/model/user.model";
import { TokenModel } from "src/DB/model/token.model";


@Module({
    imports:[UserModel,TokenModel],
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