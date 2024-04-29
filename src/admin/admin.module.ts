import { Module } from "@nestjs/common";
import { AdminPanelController } from "./adminPanel.controller";
import { MulterModule } from '@nestjs/platform-express';
import { MulterMiddleware } from './adminPanel.middleware';


@Module({
    imports: [MulterModule.registerAsync({
        useClass: MulterMiddleware,
    }),],
    controllers: [AdminPanelController],
    providers: []
})

export class AdminModule { }