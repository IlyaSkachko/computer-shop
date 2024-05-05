import { Controller, Get, Post, Res, Req, UnauthorizedException } from "@nestjs/common";
import { Response, Request } from 'express';
import { DBRegistration } from '../database/Users/DBRegistration'
import * as bcrypt from 'bcrypt';
import { DBAuth } from "src/database/Users/DBAuth";
import { TokenService } from "./token/token.service";
import { DBInit } from "src/database/DBInit";
import { DBToken } from "src/database/Users/DBToken";
import { TokenExpiredError } from "@nestjs/jwt";



@Controller()
export class AuthController {
    private db: DBInit;

    constructor(private readonly tokenService: TokenService) {
    }

    @Get("/auth")
    async getPage(@Res() res: Response, @Req() req: Request) {
        try {
            let accessToken = req.cookies["accessToken"];
            const refreshToken = req.cookies["refreshToken"];

            if (!accessToken) {
                return res.render('index.hbs', { layout: false, main: false, auth: true });
            }

            const verifyAccessToken = await this.tokenService.verifyJwtToken(accessToken);

            if (!verifyAccessToken) {
                const refreshTokenPayload = await this.tokenService.verifyJwtToken(refreshToken);
                if (refreshTokenPayload) {
                    const user = refreshTokenPayload.user;
                    accessToken = await this.tokenService.generateAccessJwtToken(user);
                    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "none" });
                    if (user.role === "ADMIN") {
                        res.redirect("/adminPanel");
                        return;
                    }
                    res.redirect("/user/profile");
                    return;
                }
            }

            if (verifyAccessToken.user.role === "ADMIN") {
                res.redirect("/adminPanel");
                return;
            }
            res.redirect("/user/profile");
        } catch (err) {
            res.sendStatus(500);
        }
    }



    @Post("/auth")
    async postAuth(@Req() req: Request, @Res() res: Response) {
        try {
            const { login, password } = req.body;

            this.db = new DBAuth;

            const oldAccessToken = req.cookies["accessToken"];
            const oldRefreshToken = req.cookies["refreshToken"];
            let verify;
            if (await this.tokenService.verifyJwtToken(oldAccessToken) && (verify = await this.tokenService.verifyJwtToken(oldRefreshToken))) {
                if (verify.user.login === login) {
                    res.sendStatus(200);
                    return;
                }

            }
            
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            const user = await (this.db as DBAuth).getUser(login);
            if (user) {
                const role = user.Role;
                const passwordMatch = await bcrypt.compare(password, user.Password);
                if (passwordMatch) {
                    const accessToken = await this.tokenService.generateAccessJwtToken({ login, password, role });
                    const refreshToken = await this.tokenService.generateRefreshJwtToken({ login, password, role });
                    this.db = new DBToken;
                    const refreshTokenDb = await (this.db as DBToken).getToken(refreshToken);
                    if (!refreshTokenDb) {
                        await (this.db as DBToken).postToken(refreshToken, user.ID);
                        res.set('Authorization', `Bearer ${accessToken}`);
                        res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "strict", });
                        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict", });
                        res.sendStatus(200);
                        return;
                    }

                    throw new Error();
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
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.redirect("/");
    }
}