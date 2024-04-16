import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import {DBStorageDevice} from '../database/Products/DBStorageDevice'

@Controller('storageDevices')
export class StorageDeviceController {

    private db: DBStorageDevice;

    constructor() {
        this.db = new DBStorageDevice();
    }

    @Get()
    async getPage(@Res() res: Response) {
        try {
            const storageDevices = await this.db.getStorageDevices();
            return res.render('index.hbs', { layout: false, main: false, footer: true, header: true, storageDevices});
        } catch(err) {
            res.sendStatus(500);
        }
    }
}
