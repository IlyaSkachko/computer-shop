import { Controller, Get, Res, Query, Req, ParseIntPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { DBStorageDevice } from '../database/Products/DBStorageDevice'
import { TokenService } from 'src/authorization/token/token.service';
import { Page } from './page.enum';



@Controller()
export class StorageDeviceController {

    private db: DBStorageDevice;

    constructor(private readonly tokenService: TokenService) {
        this.db = new DBStorageDevice();
    }

    @Get('/storageDevices')
    async getPage(@Query('page', ParseIntPipe) page: number, @Res() res: Response, @Req() req: Request) {
        try {

            const pageSize = Page.SIZE;

            if (isNaN(page) || page < 1) {
                page = 1;
            }

            let skip = pageSize * (page - 1);
            const storageDevices = await this.db.getPageStorageDevices(skip, pageSize);
            const storage_frequency = await this.db.getFrequency();
            const storage_memory = await this.db.getMemory();
            const storage_type = await this.db.getType();


            const refreshToken = req.cookies["refreshToken"];

            if (refreshToken) {
                if (await this.tokenService.isAdmin(refreshToken)) {
                    return res.render('index.hbs', {
                        layout: false, storage_filter: true, isAdmin: true, main: false, footer: true, header: true, storageDevices, storage_frequency,
                        storage_memory, storage_type
                    });
                }
            }
            return res.render('index.hbs', {
                layout: false, storage_filter: true, main: false, footer: true, header: true, isUser: true, storageDevices, storage_frequency,
                storage_memory, storage_type
            });

            } catch (err) {
                res.sendStatus(500);
            }
        }


    @Get("/storageDevices/filter")
        async getRamFilter(@Res() res: Response, @Query() query: any, @Req() req: Request) {
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



            const refreshToken = req.cookies["refreshToken"];

            if (refreshToken) {
                if (await this.tokenService.isAdmin(refreshToken)) {
                    return res.render('index.hbs', {
                        layout: false, isAdmin:true, storage_filter: true, main: false, footer: true, header: true, storageDevices, storage_frequency,
                        storage_memory, storage_type
                    });
                }
            }

        return res.render('index.hbs', {
            layout: false, isUser: true, storage_filter: true, main: false, footer: true, header: true, storageDevices, storage_frequency,
            storage_memory, storage_type
        });
        }
    }
