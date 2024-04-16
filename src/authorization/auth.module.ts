import { Module } from "@nestjs/common";
import { RegistrationController } from "./registration.controller";

@Module({
    imports: [],
    controllers: [RegistrationController],
    providers: []
})

export class AuthModule{}