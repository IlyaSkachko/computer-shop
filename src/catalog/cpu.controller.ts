import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DBCpu } from '../database/Products/DBCpu'


@Controller("/CPUs")
export class CPUController {
    private db: DBCpu;

    constructor() {
        this.db = new DBCpu();
    }

    @Get()
    async getPage(@Res() res: Response) {
        try {
            const cpus = await this.db.getCPUs();
            return res.render('index.hbs', { layout: false, main: false, footer: true, header: true, cpus});
        } catch(err) {
            res.sendStatus(500);
        }
    }
}