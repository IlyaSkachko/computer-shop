import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { TokenService } from "./token/token.service";
import { Request, Response } from "express";
import { DBInit } from "src/database/DBInit";
import { DBToken } from "src/database/Users/DBToken";
import { DBAuth } from "src/database/Users/DBAuth";


@Injectable()
export class JwtMiddleware implements NestMiddleware {

    private readonly db: DBToken;
    private readonly db_auth: DBAuth;

    constructor(private readonly tokenService: TokenService) {
        this.db_auth = new DBAuth();
        this.db = new DBToken();
    }

    async use(req: Request, res: Response, next: NextFunction) {

        try {
            let accessToken = req.cookies["accessToken"];
            let refreshToken = req.cookies["refreshToken"];

            const accessTokenPayload = await this.tokenService.verifyJwtToken(accessToken);
            const refreshTokenPayload = await this.tokenService.verifyJwtToken(refreshToken);

            if (refreshToken != undefined) {
                if (!accessTokenPayload) {
                    res.clearCookie("accessToken");
                    if (!refreshTokenPayload) {
                        res.clearCookie("refreshToken");
                        const { login, password } = req.body;
                        const user = await this.db_auth.getUser(login);
                        const newRefreshToken = await this.tokenService.generateRefreshJwtToken(user);

                        const refreshTokenDb = await (this.db as DBToken).getToken(newRefreshToken);
                        await (this.db as DBToken).delToken(refreshToken);
                        if (!refreshTokenDb) {
                            await (this.db as DBToken).postToken(newRefreshToken, user.ID);
                            const newAccessToken = await this.tokenService.generateAccessJwtToken(user);
                            res.set('Authorization', `Bearer ${newAccessToken}`);
                            res.cookie("accessToken", newAccessToken, { httpOnly: true, sameSite: "none", });
                            res.cookie("refreshToken", newRefreshToken, { httpOnly: true, sameSite: "none", });
                            next();
                            return;
                        }
                    }

                    const user = refreshTokenPayload.user;
                    const newAccessToken = await this.tokenService.generateAccessJwtToken(user);
                    res.set('Authorization', `Bearer ${newAccessToken}`);
                    res.cookie("accessToken", newAccessToken, { httpOnly: true, sameSite: "none", });
                    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "none", });
                    next();
                    return;
                }
            }
            next();
        } catch (e) {
            res.statusCode = 500;
            res.send(`<h1>Internal Server Error</h1>`);
        }
    }
}