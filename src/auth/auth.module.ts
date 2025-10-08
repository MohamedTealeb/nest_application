import { Module } from "@nestjs/common";
import { AuthenticationService } from "./auth.service";
import { AuthenticationController } from "./auth.controller";




@Module({
    imports:[],
    exports:[AuthenticationService],
    providers:[AuthenticationService],
    controllers:[AuthenticationController]




})
export class AuthModule{}