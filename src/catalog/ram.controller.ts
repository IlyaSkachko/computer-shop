import { Controller, Get, Res, Query, Req, ParseIntPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { DBRam } from '../database/Products/DBRam'
import { TokenService } from 'src/authorization/token/token.service';
import { Page } from './page.enum';

@Controller()
export class RAMController {

    private db: DBRam;

    constructor(private readonly tokenService: TokenService) {
        this.db = new DBRam();
    }

    @Get("/rams")
    async getPage(@Query('page', ParseIntPipe) page: number, @Res() res: Response, @Req() req: Request) {
        try {

            const pageSize = Page.SIZE;

            if (isNaN(page) || page < 1) {
                page = 1;
            }

            let skip = pageSize * (page - 1);

            const rams = await this.db.getPageRAMs(skip, pageSize);
            const ram_frequency = await this.db.getFrequency();
            const ram_memory = await this.db.getMemory();
            const ram_type = await this.db.getType();
            const ram_port = await this.db.getTypePort();


            const refreshToken = req.cookies["refreshToken"];

            if (refreshToken) {
                if (await this.tokenService.isAdmin(refreshToken)) {
                    return res.render('index.hbs', {
                        layout: false, ram_filter: true, main: false, isAdmin: true, footer: true, header: true, rams, ram_frequency, ram_memory, ram_type,
                        ram_port
                    });
                }
            }
            return res.render('index.hbs', { layout: false, ram_filter: true, isUser: true, main: false, footer: true, header: true, rams, ram_frequency, ram_memory, ram_type, 
                ram_port});
        } catch(err) {
            res.sendStatus(500);
        }
    }


    @Get("/rams/filter")
    async getRamFilter(@Res() res: Response, @Query() query: any, @Req() req: Request) {
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

        const refreshToken = req.cookies["refreshToken"];

        if (refreshToken) {
            if (await this.tokenService.isAdmin(refreshToken)) {
                return res.render('index.hbs', { layout: false, ram_filter: true, main: false, isAdmin: true, isUser: false, footer: true, header: true, rams, ram_frequency, ram_type, ram_port, ram_memory });
            }
        }

        return res.render('index.hbs', { layout: false, ram_filter: true, main: false, isUser: true, isAdmin: false, footer: true, header: true, rams, ram_frequency, ram_type, ram_port, ram_memory });
    }
}
