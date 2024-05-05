import { Controller, Get, Res, Query, Req, ParseIntPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { DBCpu } from '../database/Products/DBCpu'
import { TokenService } from 'src/authorization/token/token.service';
import { Page } from './page.enum';


@Controller()
export class CPUController {
    private db: DBCpu;

    constructor(private readonly tokenService: TokenService) {
        this.db = new DBCpu();
    }

    @Get("/cpus")
    async getPage(@Query('page', ParseIntPipe) page: number, @Res() res: Response, @Req() req: Request) {
        try {
            const refreshToken = req.cookies["refreshToken"];

            const pageSize = Page.SIZE;

            if (isNaN(page) || page < 1) {
                page = 1;
            }

            let skip = pageSize * (page - 1);


            const cpus = await this.db.getPageCPUs(skip, pageSize);
            const cpu_frequency = await this.db.getFrequency();
            const cpu_cores = await this.db.getCores();
            const cpu_cache = await this.db.getCache();


            if (refreshToken) {
                if (await this.tokenService.isAdmin(refreshToken)) {
                    return res.render('index.hbs', { layout: false, cpu_filter: true, main: false, footer: true, isAdmin: true, header: true, cpus, cpu_frequency, cpu_cores, cpu_cache });
                }
            }

            return res.render('index.hbs', { layout: false, cpu_filter: true, main: false, footer: true, header: true, isUser: true, cpus, cpu_frequency, cpu_cores, cpu_cache });

        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/cpus/filter")
    async getCpuFilter(@Res() res: Response, @Query() query: any, @Req() req: Request) {

        const refreshToken = req.cookies["refreshToken"];

        let cpus = await this.db.getCPUs();
        const cpu_frequency = await this.db.getFrequency();
        const cpu_cores = await this.db.getCores();
        const cpu_cache = await this.db.getCache();

        const { price_from, price_to, filter_menu_frequency, filter_menu_cache, filter_menu_cores } = query;


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


        if (refreshToken) {
            if (await this.tokenService.isAdmin(refreshToken)) {
                return res.render('index.hbs', { layout: false, cpu_filter: true, main: false, footer: true, isAdmin: true, header: true, cpus, cpu_frequency, cpu_cores, cpu_cache });

            }
        }
        return res.render('index.hbs', { layout: false, cpu_filter: true, main: false, footer: true, isUser: true, header: true, cpus, cpu_frequency, cpu_cores, cpu_cache });

    }
}