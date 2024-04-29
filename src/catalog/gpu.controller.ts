import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { DBGpu } from '../database/Products/DBGpu'

@Controller()
export class GPUController {

    private db: DBGpu;

    constructor() {
        this.db = new DBGpu();
    }

    @Get("/gpus")
    async getPage(@Res() res: Response) {
        try {
            const gpus = await this.db.getGPUs();
            const gpu_frequency = await this.db.getFrequency();
            const gpu_memory = await this.db.getMemory();
            return res.render('index.hbs', { layout: false, gpu_filter: true, main: false, footer: true, header: true, gpus, gpu_frequency, gpu_memory});
        } catch(err) {
            res.sendStatus(500);
        }
    }

    @Get("/gpus/filter")
    async getGpuFilter(@Res() res: Response, @Query() query: any) {
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
        return res.render('index.hbs', { layout: false, gpu_filter: true, main: false, footer: true, header: true, gpus, gpu_frequency, gpu_memory });
    }
}
