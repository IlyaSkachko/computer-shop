import { Controller, Get, Res, Query, Req, ParseIntPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { DBGpu } from '../database/Products/DBGpu'
import { TokenService } from 'src/authorization/token/token.service';
import { Page } from './page.enum';

@Controller()
export class GPUController {

    private db: DBGpu;

    constructor(private readonly tokenService: TokenService) {
        this.db = new DBGpu();
    }

    @Get("/gpus")
    async getPage(@Query('page', ParseIntPipe) page: number, @Res() res: Response, @Req() req: Request) {
        try {

            const pageSize = Page.SIZE;

            if (isNaN(page) || page < 1) {
                page = 1;
            }

            let skip = pageSize * (page - 1);


            const gpus = await this.db.getPageGPUs(skip, pageSize);
            const gpu_frequency = await this.db.getFrequency();
            const gpu_memory = await this.db.getMemory();

            const refreshToken = req.cookies["refreshToken"];

            if (refreshToken) {
                if (await this.tokenService.isAdmin(refreshToken)) {
                    return res.render('index.hbs', { layout: false, gpu_filter: true, main: false, footer: true, isAdmin:true, header: true, gpus, gpu_frequency, gpu_memory });
                }
            }
            return res.render('index.hbs', { layout: false, gpu_filter: true, main: false, footer: true, isUser:true, header: true, gpus, gpu_frequency, gpu_memory});
        
        } catch(err) {
            res.sendStatus(500);
        }
    }

    @Get("/gpus/filter")
    async getGpuFilter(@Res() res: Response, @Query() query: any, @Req() req: Request) {
        let gpus = await this.db.getGPUs();
        const gpu_frequency = await this.db.getFrequency();
        const gpu_memory = await this.db.getMemory();

        const { price_from, price_to, filter_menu_frequency, filter_menu_memory} = query;


        let filteredGPU = gpus;


        if (price_to !== "") {
            filteredGPU = filteredGPU.filter((gpu) => gpu.Price >= parseFloat(price_from) && gpu.Price <= parseFloat(price_to));
        } else {
            filteredGPU = filteredGPU.filter((gpu) => gpu.Price >= parseFloat(price_from));
        }

        if (filter_menu_frequency && filter_menu_frequency !== "Выбрать") {
            filteredGPU = filteredGPU.filter(
                (gpu) => gpu.Frequency === parseFloat(filter_menu_frequency)
            );
        }

        if (filter_menu_memory && filter_menu_memory !== "Выбрать") {
            filteredGPU = filteredGPU.filter(
                (gpu) => gpu.Memory === parseFloat(filter_menu_memory)
            );
        }

        gpus = filteredGPU;


        const refreshToken = req.cookies["refreshToken"];
        if (refreshToken) {
            if (await this.tokenService.isAdmin(refreshToken)) {
                return res.render('index.hbs', { layout: false, gpu_filter: true, main: false, footer: true, isAdmin: true, header: true, gpus, gpu_frequency, gpu_memory });

            }
        }

        return res.render('index.hbs', { layout: false, gpu_filter: true, main: false, footer: true, isUser: true, header: true, gpus, gpu_frequency, gpu_memory });
    }
}
