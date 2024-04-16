import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/')
export class CatalogController {
    @Get()
    getPage(@Res() res: Response) {
        return res.render('index.hbs', { layout: false, main: true, footer: true, header: true });
    }
}
