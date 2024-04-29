import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { TokenService } from "./token/token.service";
import { Request, Response } from "express";
import { DBInit } from "src/database/DBInit";
import { DBToken } from "src/database/Users/DBToken";


@Injectable()
export class JwtMiddleware implements NestMiddleware {

    private readonly db: DBToken;

    constructor(private readonly tokenService: TokenService) {
        
    }

    async use(req: Request, res: Response, next: NextFunction) {
        
        try {
            let accessToken = req.cookies["accessToken"];
            let refreshToken = req.cookies["refreshToken"];

            const accessTokenPayload = this.tokenService.verifyJwtToken(accessToken);
            const refreshTokenPayload = this.tokenService.verifyJwtToken(refreshToken);
           
            if (!accessTokenPayload) {
                if (!refreshTokenPayload) {
                    const user = refreshTokenPayload.user;
                    console.log(user);
                    const newRefreshToken = await this.tokenService.generateRefreshJwtToken(user);

                    const refreshTokenDb = await (this.db as DBToken).getToken(newRefreshToken);
                    await (this.db as DBToken).delToken(refreshToken);
                    if (!refreshTokenDb) {
                        await (this.db as DBToken).postToken(refreshToken, user.ID);
                        const newAccessToken = await this.tokenService.generateAccessJwtToken(user);
                        res.cookie("accessToken", newAccessToken, { httpOnly: true, sameSite: "strict", });
                        res.cookie("refreshToken", newRefreshToken, { httpOnly: true, sameSite: "strict", });
                        next();
                    }
                }

                const user = refreshTokenPayload.user;
                const newAccessToken = await this.tokenService.generateAccessJwtToken(user);
                res.cookie("accessToken", newAccessToken, { httpOnly: true, sameSite: "strict", });
                res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict", });
                next();
                
            }

            next();
        } catch (e) {
            res.statusCode = 500;
            res.send(`<h1>Internal Server Error</h1>`);
        }
    }
}