import { Module } from "@nestjs/common";
import { RegistrationController } from "./registration.controller";
import { TokenModule } from './token/token.module';
import { AuthController } from "./auth.controller";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [TokenModule, PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'MyComputerProject',
            signOptions: { expiresIn: '600s' },
        }),
    ],
    controllers: [RegistrationController, AuthController],
    providers: []
})

export class AuthModule{}