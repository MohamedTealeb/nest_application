import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthenticationService } from "./auth.service";
import { ConfirmEmailDto, LoginBodyDto, SignupBodyDto } from "./dto/signup.dto";

@Controller("auth")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  // @UsePipes(new ValidationPipe({ stopAtFirstError: true, whitelist: true, forbidNonWhitelisted: true }))
  @Post("signup")
  async signup(@Body() body: SignupBodyDto): Promise<{ message: string }> {
    console.log({ body });
    return await this.authenticationService.signup(body);
  }

  @HttpCode(200)
  @Post("login")
  async login(@Body() body: LoginBodyDto) {
    return await this.authenticationService.login(body);
  }

  @Patch("confirm-email")
  async confirmEmail(@Body() body: ConfirmEmailDto) {
    return await this.authenticationService.confirmEmail(body);
  }

  @Post("resend-otp")
  async resendOtp(@Body() body: { email: string }) {
    return await this.authenticationService.resendOtp(body.email);
  }
}
