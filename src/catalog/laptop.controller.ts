import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DBLaptop } from '../database/Products/DBLaptop'

@Controller('laptops')
export class LaptopController {

    private db: DBLaptop;

    constructor() {
        this.db = new DBLaptop();
    }

    @Get()
    async getPage(@Res() res: Response) {
        try {
            const laptops = await this.db.getLaptops();
            return res.render('index.hbs', { layout: false, main: false, footer: true, header: true, laptops});
        } catch(err) {
            res.sendStatus(500);
        }
    }
}
