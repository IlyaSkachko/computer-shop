import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { DBComputer } from '../database/Products/DBComputer'

@Controller()
export class ComputerController {

    private db: DBComputer;

    constructor() {
        this.db = new DBComputer();
    }

    @Get("/computers")
    async getPage(@Res() res: Response) {
        try {

            const computers = await this.db.getComputers();
            const computer_cpus = await this.db.getComputerCpus();
            const computer_gpus = await this.db.getComputerGpus();
            const computer_rams = await this.db.getComputerRams();
            const computer_hdds = await this.db.getComputerHDDs();
            const computer_ssds = await this.db.getComputerSSDs();
            return res.render('index.hbs', {
                layout: false, main: false, computer_filter: true, footer: true, header: true, computers, computer_cpus, computer_gpus, computer_rams,
                computer_hdds, computer_ssds
            });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    @Get('computers/filter') // Use '/computers/filter' route for filtering
    async getFilterComp(@Res() res: Response, @Query() query: any) {
        let computers = await this.db.getComputers();
        const computer_cpus = await this.db.getComputerCpus();
        const computer_gpus = await this.db.getComputerGpus();
        const computer_rams = await this.db.getComputerRams();
        const computer_hdds = await this.db.getComputerHDDs();
        const computer_ssds = await this.db.getComputerSSDs();

        // Получение данных из запроса
        const { price_from, price_to, filter_menu_cpu, filter_menu_gpu, filter_menu_ram, filter_menu_hdd, filter_menu_ssd } = query;

        // Применение фильтров к компьютерам
        let filteredComputers = computers;
        

        if (price_to !== "") {
            filteredComputers = filteredComputers.filter((computer) => computer.Price >= parseFloat(price_from) && computer.Price <= parseFloat(price_to));
        } else {
            filteredComputers = filteredComputers.filter((computer) => computer.Price >= parseFloat(price_from));
        }
        
        if (filter_menu_cpu && filter_menu_cpu !== "Выбрать") {
            filteredComputers = filteredComputers.filter(
                (computer) => computer.CPU === filter_menu_cpu
            );
        }

        if (filter_menu_gpu && filter_menu_gpu !== "Выбрать") {
            filteredComputers = filteredComputers.filter(
                (computer) => computer.GPU === filter_menu_gpu
            );
        }

        if (filter_menu_ram && filter_menu_ram !== "Выбрать") {
            filteredComputers = filteredComputers.filter(
                (computer) => computer.RAM === filter_menu_ram
            );
        }

        if (filter_menu_hdd && filter_menu_hdd !== "Выбрать") {
            filteredComputers = filteredComputers.filter(
                (computer) => computer.HDD === filter_menu_hdd
            );
        }

        if (filter_menu_ssd && filter_menu_ssd !== "Выбрать") {
            filteredComputers = filteredComputers.filter(
                (computer) => computer.SSD === filter_menu_ssd
            );
        }

        computers = filteredComputers;

        return res.render('index.hbs', {
            layout: false, computer_filter: true, main: false, footer: true, header: true, computers, computer_cpus, computer_gpus, computer_rams,
            computer_hdds, computer_ssds,
        });
    }
}