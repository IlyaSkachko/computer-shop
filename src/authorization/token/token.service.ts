import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {ConfigService} from "@nestjs/config"
import { verify } from 'jsonwebtoken';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';



@Injectable()
export class TokenService {

    private readonly jwtSecret = "MyComputerProject";
    private readonly accessTokenExpire = 600;
    private readonly refreshTokenExpire = 86400;

    constructor(private readonly jwtService: JwtService) {
    }

    decodeJwtToken(token: string): any {
        try {
            const decodedToken = this.jwtService.decode(token);
            return decodedToken;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    verifyJwtToken(token: string): any {
        try {
            return verify(token, this.jwtSecret);
        } catch (error) {
            return null;
        }
    }

    async generateAccessJwtToken(user) {
        const payload = { user };

        return this.jwtService.sign(payload, {
            secret: this.jwtSecret,
            expiresIn: this.accessTokenExpire
        })
    }


    async generateRefreshJwtToken(user) {
        const payload = { user };

        return this.jwtService.sign(payload, {
            secret: this.jwtSecret,
            expiresIn: this.refreshTokenExpire
        })
    }

}
