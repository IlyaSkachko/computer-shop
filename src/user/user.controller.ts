import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtMiddleware } from 'src/authorization/auth.middleware';
// import { UserMiddleware } from './user.middleware';

@Controller()
export class UserController {
    @Get("/user/profile")
    async getProfile(@Res() res: Response) {
        try {
            return res.render('index.hbs', { layout: false, header: true, main: false, profile: true });
        } catch (err) {
            res.statusCode = 401;
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }
    }
}