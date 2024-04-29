import { Controller, Get, Post, Res, Req } from "@nestjs/common";
import { Response, Request } from 'express';
import { DBRegistration } from '../database/Users/DBRegistration'
import * as bcrypt from 'bcrypt';
import { DBAuth } from "src/database/Users/DBAuth";
import { TokenService } from "./token/token.service";



@Controller()
export class AuthController {
    private db: DBAuth;

    constructor(private readonly tokenService: TokenService) {
        this.db = new DBAuth(); 
    }

    @Get("/auth")
    async getPage(@Res() res: Response) {
        try {
            return res.render('index.hbs', { layout: false, main: false, auth: true });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Post("/auth")
    async postAuth(@Req() req: Request, @Res() res: Response) {
        try {
            const { login, password } = req.body;

            const user = await this.db.getUser(login);
            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.Password);
                if (passwordMatch) {
                    const accessToken = await this.tokenService.generateAccessJwtToken({login, password});
                    const refreshToken = await this.tokenService.generateRefreshJwtToken({login, password});
                    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "strict", });
                    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict", });
                    res.sendStatus(200);
                    return;
                }
            }

            res.set("Content-Type", "application/json");
            res.statusCode = 400;
            res.json({ error: "Неверный логин или пароль" });
        } catch (err) {
            console.error("Ошибка авторизации:", err);
            res.sendStatus(500);
        }
    }

    @Get("/logout")
    async getLogout(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies.refreshToken;
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.redirect("/");
    }
}