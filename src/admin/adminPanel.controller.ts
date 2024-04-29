import { Controller, Get ,Post, Res, Req, UseInterceptors, UploadedFile, UseGuards, SetMetadata } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { Multer } from 'multer';
import { DBInit } from 'src/database/DBInit';
import { DBComputer } from 'src/database/Products/DBComputer';
import { DBGpu } from 'src/database/Products/DBGpu';
import { DBCpu } from 'src/database/Products/DBCpu';
import { DBLaptop } from 'src/database/Products/DBLaptop';
import { DBRam } from 'src/database/Products/DBRam';
import { DBStorageDevice } from 'src/database/Products/DBStorageDevice';
import { DBOrder } from 'src/database/Orders/DBOrders';
import { JwtMiddleware } from 'src/authorization/auth.middleware';


@Controller()
export class AdminPanelController {

    private db: DBInit;



    @Get("/adminPanel/orders") 
    async getOrders(@Res() res: Response) {
        try {
            this.db = new DBOrder();
            const allOrders = await (this.db as DBOrder).getOrders();

            
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, order: true, adminPanel: true, allOrders
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }


    @Post("/adminPanel/addStorageDevice")
    @UseInterceptors(FileInterceptor('Image'))
    async setStorageDevice(
        @Res() res: Response,
        @Req() req: Request,
        @UploadedFile() file: Multer.File,
    ) {

        this.db = new DBStorageDevice();
        const { Name, Type, Frequency, Memory, Price } = req.body;

        try {
            (this.db as DBStorageDevice).setStorageDevice(Name, Type, Frequency, Memory,  Price, file.originalname);
            res.redirect("/adminPanel/rams");

        } catch (e) {
            console.log(e);
            res.statusCode = 500;
            res.send(`<h1>${res.statusCode} Internal Server Error</h1>`);
        }
    }

    @Post("/adminPanel/addRAM")
    @UseInterceptors(FileInterceptor('Image'))
    async setRAM(
        @Res() res: Response,
        @Req() req: Request,
        @UploadedFile() file: Multer.File,
    ) {

        this.db = new DBRam();
        const { Name, Type, Frequency, Memory, TypePort, Price } = req.body;

        try {
            (this.db as DBRam).setRAM(Name, Type, Frequency, Memory, TypePort, Price, file.originalname);
            res.redirect("/adminPanel/rams");

        } catch (e) {
            console.log(e);
            res.statusCode = 500;
            res.send(`<h1>${res.statusCode} Internal Server Error</h1>`);
        }
    }



    @Post("/adminPanel/addComputer")
    @UseInterceptors(FileInterceptor('Image'))
    async setComputer(
        @Res() res: Response,
        @Req() req: Request,
        @UploadedFile() file: Multer.File,
    ) {
        this.db = new DBComputer();


        const { Name, CPU, GPU, RAM, HDD, SSD, Price } = req.body;

        try {
                (this.db as DBComputer).setComputer(Name, CPU, GPU, RAM, Price, file.originalname, HDD, SSD);
                res.redirect("/adminPanel/computers");

        } catch (e) {
            res.statusCode = 500;
            res.send(`<h1>${res.statusCode} Internal Server Error</h1>`);
        }
    }

    @Post("/adminPanel/addLaptop")
    @UseInterceptors(FileInterceptor('Image'))
    async setLaptop(
        @Res() res: Response,
        @Req() req: Request,
        @UploadedFile() file: Multer.File,
    ) {

        this.db = new DBLaptop();
        const { Name, Model, CPU, GPU, RAM, HDD, SSD, Price } = req.body;

        try {
            (this.db as DBLaptop).setLaptop(Name, Model, CPU, GPU, RAM, Price, file.originalname, HDD, SSD);
            res.redirect("/adminPanel/laptops");

        } catch (e) {
            console.log(e);
            res.statusCode = 500;
            res.send(`<h1>${res.statusCode} Internal Server Error</h1>`);
        }
    }

    @Post("/adminPanel/addGPU")
    @UseInterceptors(FileInterceptor('Image'))
    async setGPU(
        @Res() res: Response,
        @Req() req: Request,
        @UploadedFile() file: Multer.File,
    ) {

        this.db = new DBGpu();
        const { Name, Frequency, Memory, Price } = req.body;

        try {
            (this.db as DBGpu).setGPU(Name, Frequency, Memory, Price, file.originalname);
            res.redirect("/adminPanel/gpus");

        } catch (e) {
            console.log(e);
            res.statusCode = 500;
            res.send(`<h1>${res.statusCode} Internal Server Error</h1>`);
        }
    }


    @Post("/adminPanel/addCPU")
    @UseInterceptors(FileInterceptor('Image'))
    async setCPU(
        @Res() res: Response,
        @Req() req: Request,
        @UploadedFile() file: Multer.File,
    ) {

        this.db = new DBCpu();
        const { Name, Frequency, Cores, Cache, Price } = req.body;

        try {
            (this.db as DBCpu).setCPU(Name, Frequency, Cores, Cache, Price, file.originalname);
            res.redirect("/adminPanel/cpus");

        } catch (e) {
            console.log(e);
            res.statusCode = 500;
            res.send(`<h1>${res.statusCode} Internal Server Error</h1>`);
        }
    }

    @Get("/adminPanel") 
    async getPage(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, adminPanel: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/computers") 
    async getComputerPanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, computerPanel: true, adminPanel: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/laptops")
    async getLaptopPanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, laptopPanel: true, adminPanel: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/gpus")
    async getGPUPanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, gpuPanel: true, adminPanel: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/cpus")
    async getCPUPanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, cpuPanel: true, adminPanel: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/rams")
    async getRAMPanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, ramPanel: true, adminPanel: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/storageDevices")
    async getStoragePanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, storageDevicesPanel: true, adminPanel: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }
}
