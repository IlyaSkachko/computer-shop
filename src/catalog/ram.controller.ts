import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { DBRam } from '../database/Products/DBRam'

@Controller()
export class RAMController {

    private db: DBRam;

    constructor() {
        this.db = new DBRam();
    }

    @Get("/rams")
    async getPage(@Res() res: Response) {
        try {
            const rams = await this.db.getRAMs();
            const ram_frequency = await this.db.getFrequency();
            const ram_memory = await this.db.getMemory();
            const ram_type = await this.db.getType();
            const ram_port = await this.db.getTypePort();
            return res.render('index.hbs', { layout: false, ram_filter: true, main: false, footer: true, header: true, rams, ram_frequency, ram_memory, ram_type, 
                ram_port});
        } catch(err) {
            res.sendStatus(500);
        }
    }


    @Get("/rams/filter")
    async getRamFilter(@Res() res: Response, @Query() query: any) {
        let rams = await this.db.getRAMs();
        const ram_frequency = await this.db.getFrequency();
        const ram_memory = await this.db.getMemory();
        const ram_type = await this.db.getType();
        const ram_port = await this.db.getTypePort();

        const { price_from, price_to, filter_menu_frequency, filter_menu_memory, filter_menu_port, filter_menu_type } = query;

        let filteredRAM = rams;


        if (price_to !== "") {
            filteredRAM = filteredRAM.filter((ram) => ram.Price >= parseFloat(price_from) && ram.Price <= parseFloat(price_to));
        } else {
            filteredRAM = filteredRAM.filter((ram) => ram.Price >= parseFloat(price_from));
        }

        if (filter_menu_frequency && filter_menu_frequency !== "Выбрать") {
            filteredRAM = filteredRAM.filter(
                (ram) => ram.Frequency === parseFloat(filter_menu_frequency)
            );
        }

        if (filter_menu_memory && filter_menu_memory !== "Выбрать") {
            filteredRAM = filteredRAM.filter(
                (ram) => ram.Memory === parseFloat(filter_menu_memory)
            );
        }

        if (filter_menu_port && filter_menu_port !== "Выбрать") {
            filteredRAM = filteredRAM.filter(
                (ram) => ram.TypePort === filter_menu_port
            );
        }

        if (filter_menu_type && filter_menu_type !== "Выбрать") {
            filteredRAM = filteredRAM.filter(
                (ram) => ram.Type === filter_menu_type
            );
        }

        rams = filteredRAM;

        return res.render('index.hbs', { layout: false, ram_filter: true, main: false, footer: true, header: true, rams, ram_frequency, ram_type, ram_port, ram_memory });
    }
}
