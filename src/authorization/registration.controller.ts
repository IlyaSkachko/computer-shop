import { Controller, Get, Post, Res, Body } from "@nestjs/common";
import { Response } from 'express';
import {DBRegistration} from '../database/Users/DBRegistration'

import * as bcrypt from 'bcrypt';


@Controller("/registration")
export class RegistrationController {
    private db: DBRegistration;

    constructor() {
        this.db = new DBRegistration();
    }

    @Get()
    async getPage(@Res() res: Response) {
        try {
            return res.render('index.hbs', { layout: false, main: false, registration: true});
        } catch(err) {
            res.sendStatus(500);
        }
    }

    @Post()
    async postReg(@Body() data: any, @Res() res: Response) {
        try {
            const { name, surname, email, phone, login, password } = data;

            if (await this.db.getUser(login)) {
                res.set("Content-Type", "application/json");
                res.statusCode = 400;
                res.json({ error: "Такой пользователь уже существует" });
                return;
            }

            const salt = 10;

            let hashedPassword: string;
            try {
                hashedPassword = await bcrypt.hash(password, salt);
            } catch (err) {
                console.error("Ошибка хеширования пароля:", err);
                res.set("Content-Type", "application/json");
                res.statusCode = 400;
                res.json({ error: "Ошибка регистрации!" });
                return;
            }

            await this.db.postUser(name, surname, login, hashedPassword, email, phone, "USER");

            res.redirect("/")
        } catch (err) {
            console.error("Ошибка регистрации:", err);
            res.statusCode = 400;
            res.json({ error: "Ошибка в данных" });
        }
    }
}