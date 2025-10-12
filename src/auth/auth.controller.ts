import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthenticationService } from "./auth.service";
import { LoginBodyDto, SignupBodyDto } from "./dto/signup.dto";

@Controller("auth")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  // @UsePipes(new ValidationPipe({ stopAtFirstError: true, whitelist: true, forbidNonWhitelisted: true }))
  @Post("signup")
  async signup(@Body() body: SignupBodyDto): Promise<{ message: string }> {
    console.log({ body });
    await this.authenticationService.signup(body);
    return { message: "done" };
  }

  @HttpCode(200)
  @Post("login")
  async login(@Body() body: LoginBodyDto) {
    return await this.authenticationService.login(body);
  }
}
