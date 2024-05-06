import { Controller, Get, Post, Res, Req, UseInterceptors, UploadedFile, UseGuards, SetMetadata, Delete, Param, BadRequestException, Put, ParseIntPipe, Query } from '@nestjs/common';
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
import { Roles } from 'src/authorization/roles.decorator';
import { ROLE } from 'src/authorization/role.enum';
import { RolesGuard } from 'src/authorization/role.guard';
import { TokenService } from 'src/authorization/token/token.service';
import { DBAuth } from 'src/database/Users/DBAuth';
import { DBShoppingCart } from 'src/database/Orders/DBShoppingCart';
import { CPU, Computer, GPU, Laptop, RAM, StorageDevice } from 'src/catalog/catalog.interface';
import { Page } from 'src/catalog/page.enum';


@UseGuards(RolesGuard)
@Roles(ROLE.Admin)
@Controller()
export class AdminPanelController {

    private db: DBInit;
    private readonly dbAuth: DBAuth;
    private readonly dbComputer: DBComputer;
    private readonly dbGpu: DBGpu;
    private readonly dbCpu: DBCpu;
    private readonly dbRam: DBRam;
    private readonly dbLaptop: DBLaptop;
    private readonly dbStorageDevice: DBStorageDevice;
    private readonly dbOrder: DBOrder;

    constructor(private readonly tokenService: TokenService) {
        this.dbAuth = new DBAuth();
        this.dbComputer = new DBComputer();
        this.dbGpu = new DBGpu();
        this.dbCpu = new DBCpu();
        this.dbRam = new DBRam();
        this.dbLaptop = new DBLaptop();
        this.dbStorageDevice = new DBStorageDevice();
        this.dbOrder = new DBOrder();
    }

    @Put("/adminPanel/acceptOrder")
    async acceptOrder(@Res() res: Response, @Req() req: Request) {
        try {
            const { userId } = req.body;

            await this.dbOrder.changeOrder("Принято", userId);

            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }
    }

    @Put("/adminPanel/cancelOrder")
    async cancelOrder(@Res() res: Response, @Req() req: Request) {
        try {
            const { userId } = req.body;

            await this.dbOrder.changeOrder("Отклонено", userId);
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }
    }

    @Delete("/adminPanel/deleteOrder")
    async deleteOrder(@Res() res: Response, @Req() req: Request) {

        try {
            const { userId, orderId } = req.body;

            await this.dbOrder.deleteOrder(userId);

            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }
    }

    @Get("/adminPanel/orders")
    async getOrders(@Query('page', ParseIntPipe) page: number, @Res() res: Response, @Req() req: Request) {
        try {

            const pageSize = Page.SIZE;

            if (isNaN(page) || page < 1) {
                page = 1;
            }

            let skip = pageSize * (page - 1);

            const orders = await this.dbOrder.getOrders();

            let result = [];

            let order = {
                UserId: 0,
                computers: [],
                cpus: [],
                gpus: [],
                laptops: [],
                rams: [],
                storageDevices: [],
                price: 0,
                Status: "",
                Address: "",
                UserInfo: { Phone: "", Name: "" }
            };


            for (let i = 0; i < orders.length; i++) {
                let userID = orders[i].UserId
                if (i == 0) {
                    order.UserId = userID;
                    const user = await this.dbAuth.getUserById(userID);
                    order.UserInfo = { Phone: user.Phone, Name: `${user.Name} ${user.Surname}` }
                    order.Address = orders[i].Address;
                    order.Status = orders[i].Status;
                } else {
                    if (orders[i].UserId != orders[i - 1].UserId) {
                        order.price = parseFloat(order.price.toFixed(2));
                        result.push(order);
                        order = {
                            UserId: 0,
                            computers: [],
                            cpus: [],
                            gpus: [],
                            laptops: [],
                            rams: [],
                            storageDevices: [],
                            price: 0,
                            Status: "",
                            Address: "",
                            UserInfo: { Phone: "", Name: "" }
                        };
                        order.Address = orders[i].Address;
                        order.UserId = userID;
                        const user = await this.dbAuth.getUserById(userID);
                        order.UserInfo = { Phone: user.Phone, Name: `${user.Name} ${user.Surname}` }
                        order.Status = orders[i].Status;
                    }
                }

                if (orders[i].ComputerId) {
                    const computer = await this.dbComputer.getComputer(orders[i].ComputerId)
                    order.computers.push(computer);
                    order.price += computer.Price;
                }
                if (orders[i].LaptopId) {
                    const laptop = await this.dbLaptop.getLaptop(orders[i].LaptopId);
                    order.laptops.push(laptop);
                    order.price += parseFloat(laptop.Price.toFixed(2));
                }
                if (orders[i].CPU_ID) {
                    const cpu = await this.dbCpu.getCPU(orders[i].CPU_ID);
                    order.cpus.push(cpu);
                    order.price += parseFloat(cpu.Price.toFixed(2));
                }
                if (orders[i].GPU_ID) {
                    const gpu = await this.dbGpu.getGPU(orders[i].GPU_ID);
                    order.gpus.push(gpu);
                    order.price += gpu.Price;
                }
                if (orders[i].RAM_ID) {
                    const ram = await this.dbRam.getRAM(orders[i].RAM_ID);
                    order.rams.push(ram);
                    order.price += ram.Price;
                }
                if (orders[i].StorageDeviceId) {
                    const storageDevice = await this.dbStorageDevice.getStorageDevice(orders[i].StorageDeviceId);
                    order.storageDevices.push(storageDevice);
                    order.price += storageDevice.Price;
                }

                if (i == orders.length - 1) {
                    order.price = parseFloat(order.price.toFixed(2))
                    result.push(order);
                }
            }

            result = result.slice(skip, skip + pageSize);

            if (result.length > 1) {
                return res.render('index.hbs', {
                    layout: false, main: false, footer: true, header: true, order: true, adminPanel: true, isAdmin: true, page: true, result
                });
            } else {
                return res.render('index.hbs', {
                    layout: false, main: false, footer: true, header: true, order: true, adminPanel: true, isAdmin: true, result
                });
            }
        } catch (err) {
            console.log(err);
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
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
            (this.db as DBStorageDevice).setStorageDevice(Name, Type, Frequency, Memory, Price, file.originalname);
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
                layout: false, main: false, footer: true, header: true, adminPanel: true, isAdmin: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/computers")
    async getComputerPanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, computerPanel: true, adminPanel: true, isAdmin: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/laptops")
    async getLaptopPanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, laptopPanel: true, adminPanel: true, isAdmin: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/gpus")
    async getGPUPanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, gpuPanel: true, adminPanel: true, isAdmin: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/cpus")
    async getCPUPanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, cpuPanel: true, adminPanel: true, isAdmin: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/rams")
    async getRAMPanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, ramPanel: true, adminPanel: true, isAdmin: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }

    @Get("/adminPanel/storageDevices")
    async getStoragePanel(@Res() res: Response) {
        try {
            return res.render('index.hbs', {
                layout: false, main: false, footer: true, header: true, storageDevicesPanel: true, adminPanel: true, isAdmin: true
            });
        } catch (err) {
            res.sendStatus(500);
        }
    }


    @Delete("/deleteProduct/:product")
    async deleteProduct(@Param('product') product: string, @Req() req: Request, @Res() res: Response) {
        try {
            const product = req.params.product;
            const productId = parseInt(req.body.productId);

            switch (product) {
                case "computer":
                    await this.dbComputer.deleteComputer(productId);
                    break;
                case "gpu":
                    await this.dbGpu.deleteGPU(productId);
                    break;
                case "cpu":
                    await this.dbCpu.deleteCPU(productId);
                    break;
                case "laptop":
                    await this.dbLaptop.deleteLaptop(productId);
                    break;
                case "storageDevice":
                    await this.dbStorageDevice.deleteStorageDevice(productId);
                    break;
                case "ram":
                    await this.dbRam.deleteRAM(productId);
                    break;
                default:
                    throw new BadRequestException();
            }

            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }
    }


}
