import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import {DBStorageDevice} from '../database/Products/DBStorageDevice'

@Controller()
export class StorageDeviceController {

    private db: DBStorageDevice;

    constructor() {
        this.db = new DBStorageDevice();
    }

    @Get('/storageDevices')
    async getPage(@Res() res: Response) {
        try {
            const storageDevices = await this.db.getStorageDevices();
            const storage_frequency = await this.db.getFrequency();
            const storage_memory = await this.db.getMemory();
            const storage_type = await this.db.getType();

            return res.render('index.hbs', { layout: false, storage_filter: true, main: false, footer: true, header: true, storageDevices, storage_frequency, 
                            storage_memory, storage_type});
        } catch(err) {
            res.sendStatus(500);
        }
    }


    @Get("/storageDevices/filter")
    async getRamFilter(@Res() res: Response, @Query() query: any) {
        let storageDevices = await this.db.getStorageDevices();
        const storage_frequency = await this.db.getFrequency();
        const storage_memory = await this.db.getMemory();
        const storage_type = await this.db.getType();

        const { price_from, price_to, filter_menu_frequency, filter_menu_memory, filter_menu_type } = query;

        let filteredStorage = storageDevices;

        console.log(price_from, price_to, filter_menu_frequency, filter_menu_memory, filter_menu_type);
        console.log(filteredStorage);

        if (price_to !== "") {
            filteredStorage = filteredStorage.filter((storage) => storage.Price >= parseFloat(price_from) && storage.Price <= parseFloat(price_to));
        } else {
            filteredStorage = filteredStorage.filter((storage) => storage.Price >= parseFloat(price_from));
        }

        if (filter_menu_frequency && filter_menu_frequency !== "Выбрать") {
            filteredStorage = filteredStorage.filter(
                (ram) => ram.Frequency === parseFloat(filter_menu_frequency)
            );
        }

        if (filter_menu_memory && filter_menu_memory !== "Выбрать") {
            filteredStorage = filteredStorage.filter(
                (ram) => ram.Memory === parseFloat(filter_menu_memory)
            );
        }

        if (filter_menu_type && filter_menu_type !== "Выбрать") {
            filteredStorage = filteredStorage.filter(
                (ram) => ram.Type === filter_menu_type
            );
        }

        storageDevices = filteredStorage;

        return res.render('index.hbs', {
            layout: false, storage_filter: true, main: false, footer: true, header: true, storageDevices, storage_frequency,
            storage_memory, storage_type
        });
    }
}
