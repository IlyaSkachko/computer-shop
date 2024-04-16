import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DBRam } from '../database/Products/DBRam'

@Controller('rams')
export class RAMController {

    private db: DBRam;

    constructor() {
        this.db = new DBRam();
    }

    @Get()
    async getPage(@Res() res: Response) {
        try {
            const rams = await this.db.getRAMs();
            return res.render('index.hbs', { layout: false, main: false, footer: true, header: true, rams});
        } catch(err) {
            res.sendStatus(500);
        }
    }
}
