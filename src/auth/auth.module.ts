import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthenticationService } from "./auth.service";
import { AuthenticationController } from "./auth.controller";
import { UserModel } from "src/DB/model/user.model";
import { UserRepository } from "src/DB/repository/user.repository";
import { TokenSecurity } from "src/common/utils/security/token.security";
import { TokenModel } from "src/DB/model/token.model";




@Module({
  imports: [
    UserModel,
    TokenModel,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN) as unknown as number },
    }),
  ],
  exports: [AuthenticationService],
  providers: [AuthenticationService, UserRepository, TokenSecurity],
  controllers: [AuthenticationController],
})
export class AuthModule {}