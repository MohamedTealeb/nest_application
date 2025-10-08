import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";

import { AuthenticationService } from "./auth.service";
import type { Response } from "express";
import { SignupBodyDto } from "./dto/signup.dto";
import { CustomValidationPipe } from "src/common/pipes/validation.custom.pipe";
import { signupValidation } from "./autth.validation";


@Controller()
export class AuthenticationController {
constructor(private readonly AuthenticationService:AuthenticationService ){}

    @Post("/auth/signup")
    signup(@Body(new CustomValidationPipe(signupValidation)) body:SignupBodyDto):{message:string,data:{userId:number}} { 
        
        const id:number=this.AuthenticationService.signup(body)
        return {message:'done',data:{userId:id}};
    }

    @HttpCode(200)
    @Post("auth/login")
    login(){
        return "login";
    }



}