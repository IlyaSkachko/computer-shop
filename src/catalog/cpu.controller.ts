import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { DBCpu } from '../database/Products/DBCpu'


@Controller()
export class CPUController {
    private db: DBCpu;

    constructor() {
        this.db = new DBCpu();
    }

    @Get("/cpus")
    async getPage(@Res() res: Response) {
        try {
            const cpus = await this.db.getCPUs();
            const cpu_frequency = await this.db.getFrequency();
            const cpu_cores = await this.db.getCores();
            const cpu_cache = await this.db.getCache();
            return res.render('index.hbs', { layout: false, cpu_filter: true, main: false, footer: true, header: true, cpus, cpu_frequency, cpu_cores, cpu_cache});
        } catch(err) {
            res.sendStatus(500);
        }
    }

    @Get("/cpus/filter")
    async getCpuFilter(@Res() res: Response, @Query() query: any) {
        let cpus = await this.db.getCPUs();
        const cpu_frequency = await this.db.getFrequency();
        const cpu_cores = await this.db.getCores();
        const cpu_cache = await this.db.getCache();

        const { price_from, price_to, filter_menu_frequency, filter_menu_cache, filter_menu_cores} = query;


        let filteredCPU = cpus;


        if (price_to !== "") {
            filteredCPU = filteredCPU.filter((cpu) => cpu.Price >= parseFloat(price_from) && cpu.Price <= parseFloat(price_to));
        } else {
            filteredCPU = filteredCPU.filter((cpu) => cpu.Price >= parseFloat(price_from));
        }

        if (filter_menu_frequency && filter_menu_frequency !== "Выбрать") {
            filteredCPU = filteredCPU.filter(
                (cpu) => cpu.Frequency === parseFloat(filter_menu_frequency)
            );
        }

        if (filter_menu_cores && filter_menu_cores !== "Выбрать") {
            filteredCPU = filteredCPU.filter(
                (cpu) => cpu.Cores === parseInt(filter_menu_cores)
            );
        }

        if (filter_menu_cache && filter_menu_cache !== "Выбрать") {
            filteredCPU = filteredCPU.filter(
                (cpu) => cpu.Cache === parseInt(filter_menu_cache)
            );
        }

        cpus = filteredCPU;
        return res.render('index.hbs', { layout: false, cpu_filter: true, main: false, footer: true, header: true, cpus, cpu_frequency, cpu_cores, cpu_cache });
    }
}