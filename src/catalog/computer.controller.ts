import { Controller, Get, Res, Query, Req, UseGuards, Param, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { Response, Request } from 'express';
import { DBComputer } from '../database/Products/DBComputer'
import { TokenService } from 'src/authorization/token/token.service';
import { Roles } from 'src/authorization/roles.decorator';
import { ROLE } from 'src/authorization/role.enum';
import { RolesGuard } from 'src/authorization/role.guard';
import { Page } from './page.enum';


@Controller()
export class ComputerController {

    private db: DBComputer;

    constructor(private readonly tokenService: TokenService) {
        this.db = new DBComputer();
    }

    @Get("/computers")
    async getPage(@Query('page', ParseIntPipe) page: number, @Res() res: Response, @Req() req: Request) {
        try {

            const pageSize = Page.SIZE;

            if (isNaN(page) || page < 1) {
                page = 1;
            }

            let skip = pageSize * (page - 1);

            const computers = await this.db.getPageComputers(skip ,pageSize);
            const computer_cpus = await this.db.getComputerCpus();
            const computer_gpus = await this.db.getComputerGpus();
            const computer_rams = await this.db.getComputerRams();
            const computer_hdds = await this.db.getComputerHDDs();
            const computer_ssds = await this.db.getComputerSSDs();

            const refreshToken = req.cookies["refreshToken"];

            if (refreshToken) {

                const verify = await this.tokenService.verifyJwtToken(refreshToken);
                if (verify.user.role === ROLE.Admin) {
                    return res.render('index.hbs', {
                        layout: false, main: false, computer_filter: true, footer: true, header: true, isAdmin: true, computers, computer_cpus, computer_gpus, computer_rams,
                        computer_hdds, computer_ssds
                    });
                }
            }

            return res.render('index.hbs', {
                layout: false, main: false, computer_filter: true, footer: true, header: true, isUser: true, computers, computer_cpus, computer_gpus, computer_rams,
                computer_hdds, computer_ssds
            });
        } catch (err) {
            console.log(err);
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }
    }

    @Get('computers/filter') // Use '/computers/filter' route for filtering
    async getFilterComp(@Res() res: Response, @Query() query: any, @Req() req: Request) {
        const refreshToken = req.cookies["refreshToken"];


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


        if (refreshToken) {
            if (await this.tokenService.isAdmin(refreshToken)) {
                return res.render('index.hbs', {
                    layout: false, computer_filter: true, main: false, footer: true, header: true, isAdmin:true, computers, computer_cpus, computer_gpus, computer_rams,
                    computer_hdds, computer_ssds,
                });
            }
        }


        return res.render('index.hbs', {
            layout: false, computer_filter: true, main: false, footer: true, header: true, isUser: true, computers, computer_cpus, computer_gpus, computer_rams,
            computer_hdds, computer_ssds,
        });
    }
}