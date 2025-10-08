import { Module } from "@nestjs/common";
import { UseController } from "./user.controller";
import { UserService } from "./user.service";


@Module({
    imports:[],
    exports:[],
    controllers:[UseController],
    providers:[UserService],
})
export class UserModule {}