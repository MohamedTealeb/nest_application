import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthenticationService } from "./auth.service";
import { AuthenticationController } from "./auth.controller";

import { UserModel } from "src/DB/model/user.model";
import { UserRepository } from "src/DB/repository/user.repository";
import { TokenSecurity } from "src/common/utils/security/token.security";
import { TokenModel } from "src/DB/model/token.model";
import { OtpRepository } from "src/DB/repository/otp.repository";
import { OtpModel } from "src/DB/model/otp.model";




@Module({
  imports: [
    UserModel,
    TokenModel,
    OtpModel,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600') },
    }),
  ],
  exports: [AuthenticationService],
  providers: [AuthenticationService, UserRepository, TokenSecurity, OtpRepository],
  controllers: [AuthenticationController],
})
export class AuthModule {}