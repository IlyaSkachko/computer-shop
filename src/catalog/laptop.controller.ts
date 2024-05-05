import { Controller, Get, Res, Query, Req, ParseIntPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { DBLaptop } from '../database/Products/DBLaptop'
import { TokenService } from 'src/authorization/token/token.service';
import { Page } from './page.enum';


@Controller()
export class LaptopController {

    private db: DBLaptop;

    constructor(private readonly tokenService: TokenService) {
        this.db = new DBLaptop();
    }

    @Get('laptops')
    async getPage(@Query('page', ParseIntPipe) page: number, @Res() res: Response, @Req() req: Request) {
        try {

            const pageSize = Page.SIZE;

            if (isNaN(page) || page < 1) {
                page = 1;
            }

            let skip = pageSize * (page - 1);

            const laptops = await this.db.getPageLaptops(skip, pageSize);
            const laptop_cpus = await this.db.getLaptopCpus();
            const laptop_gpus = await this.db.getLaptopGpus();
            const laptop_rams = await this.db.getLaptopRams();
            const laptop_hdds = await this.db.getLaptopHDDs();
            const laptop_ssds = await this.db.getLaptopSSDs();

            const refreshToken = req.cookies["refreshToken"];

            if (refreshToken) {
                if (await this.tokenService.isAdmin(refreshToken)) {
                    return res.render('index.hbs', {
                        layout: false, laptop_filter: true, main: false, isAdmin: true, footer: true, header: true, laptops, laptop_cpus, laptop_gpus, laptop_rams,
                        laptop_hdds, laptop_ssds,
                    });
                }
            }

            return res.render('index.hbs', {
                layout: false, laptop_filter: true, main: false, footer: true, isUser: true, header: true, laptops, laptop_cpus, laptop_gpus, laptop_rams,
                laptop_hdds, laptop_ssds,
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("laptops/filter")
    async getlaptopFilter(@Res() res: Response, @Query() query: any, @Req() req: Request) {
        let laptops = await this.db.getLaptops();
        const laptop_cpus = await this.db.getLaptopCpus();
        const laptop_gpus = await this.db.getLaptopGpus();
        const laptop_rams = await this.db.getLaptopRams();
        const laptop_hdds = await this.db.getLaptopHDDs();
        const laptop_ssds = await this.db.getLaptopSSDs();


        // Получение данных из запроса
        const { price_from, price_to, filter_menu_cpu, filter_menu_gpu, filter_menu_ram, filter_menu_hdd, filter_menu_ssd } = query;

        // Применение фильтров к компьютерам
        let filteredlaptops = laptops;


        if (price_to !== "") {
            filteredlaptops = filteredlaptops.filter((laptop) => laptop.Price >= parseFloat(price_from) && laptop.Price <= parseFloat(price_to));
        } else {
            filteredlaptops = filteredlaptops.filter((laptop) => laptop.Price >= parseFloat(price_from));
        }

        if (filter_menu_cpu && filter_menu_cpu !== "Выбрать") {
            filteredlaptops = filteredlaptops.filter(
                (laptop) => laptop.CPU === filter_menu_cpu
            );
        }

        if (filter_menu_gpu && filter_menu_gpu !== "Выбрать") {
            filteredlaptops = filteredlaptops.filter(
                (laptop) => laptop.GPU === filter_menu_gpu
            );
        }

        if (filter_menu_ram && filter_menu_ram !== "Выбрать") {
            filteredlaptops = filteredlaptops.filter(
                (laptop) => laptop.RAM === filter_menu_ram
            );
        }

        if (filter_menu_hdd && filter_menu_hdd !== "Выбрать") {
            filteredlaptops = filteredlaptops.filter(
                (laptop) => laptop.HDD === filter_menu_hdd
            );
        }

        if (filter_menu_ssd && filter_menu_ssd !== "Выбрать") {
            filteredlaptops = filteredlaptops.filter(
                (laptop) => laptop.SSD === filter_menu_ssd
            );
        }

        laptops = filteredlaptops;


        const refreshToken = req.cookies["refreshToken"];

        if (refreshToken) {
            if (await this.tokenService.isAdmin(refreshToken)) {
                return res.render('index.hbs', {
                    layout: false, laptop_filter: true, main: false, isAdmin: true, footer: true, header: true, laptops, laptop_cpus, laptop_gpus, laptop_rams,
                    laptop_hdds, laptop_ssds,
                });
            }
        }

        return res.render('index.hbs', {
            layout: false, laptop_filter: true, main: false, isUser: true, footer: true, header: true, laptops, laptop_cpus, laptop_gpus, laptop_rams,
            laptop_hdds, laptop_ssds,
        });
    }
}
