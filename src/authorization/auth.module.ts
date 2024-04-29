import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { RegistrationController } from "./registration.controller";
import { TokenModule } from './token/token.module';
import { AuthController } from "./auth.controller";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from "@nestjs/jwt";

import { TokenService } from "./token/token.service";
import { JwtMiddleware } from "./auth.middleware";

@Module({
    imports: [TokenModule],
    controllers: [RegistrationController, AuthController],
    providers: []
})

export class AuthModule {
}