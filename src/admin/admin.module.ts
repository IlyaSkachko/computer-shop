import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AdminPanelController } from "./adminPanel.controller";
import { MulterModule } from '@nestjs/platform-express';
import { MulterMiddleware } from './adminPanel.middleware';
import { TokenService } from "src/authorization/token/token.service";
import { JwtMiddleware } from "src/authorization/auth.middleware";
import { TokenModule } from "src/authorization/token/token.module";


@Module({
    imports: [TokenModule],
    controllers: [AdminPanelController],
    providers: []
})

export class AdminModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(AdminPanelController);
    }
 }