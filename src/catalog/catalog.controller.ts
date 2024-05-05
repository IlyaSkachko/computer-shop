import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { TokenService } from 'src/authorization/token/token.service';


@Controller('/')
export class CatalogController {
    constructor(private readonly tokenService: TokenService) {}

    @Get()
    async getPage(@Res() res: Response, @Req() req: Request) {

        const refreshToken = req.cookies["refreshToken"];

        if(refreshToken) {
            if(await this.tokenService.isAdmin(refreshToken)) {
                return res.render('index.hbs', { layout: false, main: true, footer: true, header: true, isAdmin: true });
            }
        }
        return res.render('index.hbs', { layout: false, main: true, footer: true, header: true, isUser: true });
    }
}
