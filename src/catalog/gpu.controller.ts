import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DBGpu } from '../database/Products/DBGpu'

@Controller('GPUs')
export class GPUController {

    private db: DBGpu;

    constructor() {
        this.db = new DBGpu();
    }

    @Get()
    async getPage(@Res() res: Response) {
        try {
            const gpus = await this.db.getGPUs();
            return res.render('index.hbs', { layout: false, main: false, footer: true, header: true, gpus});
        } catch(err) {
            res.sendStatus(500);
        }
    }
}
