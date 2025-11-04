import { Module } from "@nestjs/common";
import { RealtimeGateway } from "./gatway";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TokenSecurity } from "src/common/utils/security/token.security";
import { UserModel } from "src/DB/model/user.model";
import { UserRepository } from "src/DB/repository/user.repository";


@Module({
    imports: [
        ConfigModule,
        UserModel,
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>({
                secret: config.get<string>('JWT_SECRET') || 'default-secret',
                signOptions: { expiresIn: parseInt(config.get<string>('JWT_EXPIRES_IN') || '3600') }
            })
        })
    ],
    providers:[RealtimeGateway, TokenSecurity, UserRepository]
})
export class RealtimeModule {


}