import { Controller, Get, Post, Res, Req, UseGuards, BadRequestException, Param, Delete, Put } from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtMiddleware } from 'src/authorization/auth.middleware';
import { ROLE } from 'src/authorization/role.enum';
import { RolesGuard } from 'src/authorization/role.guard';
import { Roles } from 'src/authorization/roles.decorator';
import { TokenService } from 'src/authorization/token/token.service';
import { DBInit } from 'src/database/DBInit';
import { DBShoppingCart } from 'src/database/Orders/DBShoppingCart';
import { DBComputer } from 'src/database/Products/DBComputer';
import { DBCpu } from 'src/database/Products/DBCpu';
import { DBGpu } from 'src/database/Products/DBGpu';
import { DBLaptop } from 'src/database/Products/DBLaptop';
import { DBRam } from 'src/database/Products/DBRam';
import { DBStorageDevice } from 'src/database/Products/DBStorageDevice';
import { DBAuth } from 'src/database/Users/DBAuth';
import bodyParser from 'body-parser';
import { Computer, GPU, CPU, RAM, StorageDevice, Laptop } from 'src/catalog/catalog.interface';
import { DBOrder } from 'src/database/Orders/DBOrders';


@UseGuards(RolesGuard)
@Roles(ROLE.User)
@Controller()
export class UserController {
    private readonly dbAuth: DBAuth;
    private readonly dbShoppingCart: DBShoppingCart;
    private readonly dbComputer: DBComputer;
    private readonly dbGpu: DBGpu;
    private readonly dbCpu: DBCpu;
    private readonly dbRam: DBRam;
    private readonly dbLaptop: DBLaptop;
    private readonly dbStorageDevice: DBStorageDevice;
    private readonly dbOrder: DBOrder;

    constructor(private readonly tokenService: TokenService) {
        this.dbAuth = new DBAuth();
        this.dbShoppingCart = new DBShoppingCart();
        this.dbComputer = new DBComputer();
        this.dbGpu = new DBGpu();
        this.dbCpu = new DBCpu();
        this.dbRam = new DBRam();
        this.dbLaptop = new DBLaptop();
        this.dbStorageDevice = new DBStorageDevice();
        this.dbOrder = new DBOrder();
    }

    @Get("/user/profile")
    async getProfile(@Res() res: Response, @Req() req: Request) {
        try {
            const token = req.cookies["refreshToken"];
            const verify = await this.tokenService.verifyJwtToken(token);

            const user = await this.dbAuth.getUser(verify.user.login);

            return res.render('index.hbs', { layout: false, header: true, main: false, profile: true, isUser: true, user });
        } catch (err) {
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }
    }

    @Get("/user/shoppingCart")
    async getShoppingCart(@Res() res: Response, @Req() req: Request) {
        try {
            const refreshToken = req.cookies["refreshToken"];

            const verifyRefreshToken = await this.tokenService.verifyJwtToken(refreshToken);
            const login = verifyRefreshToken.user.login;

            const user = await this.dbAuth.getUser(login);
            const shoppingCart = await this.dbShoppingCart.getCart(user.ID);

            const computersCart: Computer[] = [];
            const gpusCart: GPU[] = [];
            const cpusCart: CPU[] = [];
            const ramsCart: RAM[] = [];
            const laptopsCart: Laptop[] = [];
            const storageDevicesCart: StorageDevice[] = [];


            let price = 0;

            for (const element of shoppingCart) {
                if (element.ComputerId) {
                    const computer = await this.dbComputer.getComputer(element.ComputerId);
                    price += computer.Price;
                    computersCart.push(computer);
                } else if (element.GPU_ID) {
                    const gpu = await this.dbGpu.getGPU(element.GPU_ID);
                    price += gpu.Price;
                    gpusCart.push(gpu);
                } else if (element.CPU_ID) {
                    const cpu = await this.dbCpu.getCPU(element.CPU_ID);
                    price += cpu.Price;
                    cpusCart.push(cpu);
                } else if (element.RAM_ID) {
                    const ram = await this.dbRam.getRAM(element.RAM_ID);
                    price += ram.Price;
                    ramsCart.push(ram);
                } else if (element.LaptopId) {
                    const laptop = await this.dbLaptop.getLaptop(element.LaptopId);
                    price += laptop.Price;
                    laptopsCart.push(laptop);
                } else if (element.StorageDeviceId) {
                    const storageDevice = await this.dbStorageDevice.getStorageDevice(element.StorageDeviceId);
                    price += storageDevice.Price;
                    storageDevicesCart.push(storageDevice);
                }
            }

            price = parseFloat(price.toFixed(2));

            return res.render('index.hbs', {
                layout: false, header: true, main: false, shoppingCart: true, isUser: true, computersCart, gpusCart, cpusCart, laptopsCart,
                storageDevicesCart, ramsCart, price
            });
        } catch (err) {
            console.log(err);
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }
    }

    @Post("/addToCart/:product")
    async postComputer(@Param('product') product: string, @Req() req: Request, @Res() res: Response) {
        try {
            const refreshToken = req.cookies["refreshToken"];

            if (!refreshToken) {
                res.redirect("/auth");
                return;
            }

            const verifyRefreshToken = await this.tokenService.verifyJwtToken(refreshToken);
            const user = await this.dbAuth.getUser(verifyRefreshToken.user.login);

            const product = req.params.product;
            const productId = parseInt(req.body.productId);
            let price = 0;

            switch (product) {
                case "computer":
                    const computer = await this.dbComputer.getComputer(productId);
                    price = computer.Price;
                    await this.dbShoppingCart.postComputer(user.ID, productId, price);
                    break;
                case "gpu":
                    const gpu = await this.dbGpu.getGPU(productId);
                    price = gpu.Price;
                    await this.dbShoppingCart.postGPU(user.ID, productId, price);
                    break;
                case "cpu":
                    const cpu = await this.dbCpu.getCPU(productId);
                    price = cpu.Price;
                    await this.dbShoppingCart.postCPU(user.ID, productId, price);
                    break;
                case "laptop":
                    const laptop = await this.dbLaptop.getLaptop(productId);
                    price = laptop.Price;
                    await this.dbShoppingCart.postLaptop(user.ID, productId, price);
                    break;
                case "storageDevice":
                    const storageDevice = await this.dbStorageDevice.getStorageDevice(productId);
                    price = storageDevice.Price;
                    await this.dbShoppingCart.postStorageDevice(user.ID, productId, price);
                    break;
                case "ram":
                    const ram = await this.dbRam.getRAM(productId);
                    price = ram.Price;
                    await this.dbShoppingCart.postRAM(user.ID, productId, price);
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


    @Delete("/shoppingCart/delete")
    async delProduct(@Req() req: Request, @Res() res: Response) {
        try {

            const token = req.cookies["refreshToken"];
            const validateToken = await this.tokenService.verifyJwtToken(token);

            const user = validateToken.user;

            const userID = (await this.dbAuth.getUser(user.login)).ID;


            const product = req.body.productType;
            const productId = parseInt(req.body.productId);


            const shoppingCart = await this.dbShoppingCart.getCart(userID);


            for (const element of shoppingCart) {
                switch (product) {
                    case "computer":
                        if (element.ComputerId === productId) {
                            await this.dbShoppingCart.deleteCart(element.ID, userID);
                            break;
                        }

                    case "gpu":
                        if (element.GPU_ID === productId) {
                            await this.dbShoppingCart.deleteCart(element.ID, userID);
                            break;
                        }

                    case "cpu":
                        if (element.CPU_ID === productId) {
                            await this.dbShoppingCart.deleteCart(element.ID, userID);
                            break;
                        }

                    case "laptop":
                        if (element.LaptopId === productId) {
                            await this.dbShoppingCart.deleteCart(element.ID, userID);
                            break;
                        }
                        break;
                    case "storageDevice":
                        if (element.StorageDeviceId === productId) {
                            await this.dbShoppingCart.deleteCart(element.ID, userID);
                            break;
                        }
                        break;
                    case "ram":
                        if (element.RAM_ID === productId) {
                            await this.dbShoppingCart.deleteCart(element.ID, userID);
                            break;
                        }
                        break;
                    default:
                        throw new BadRequestException();
                }
            }

            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }
    }

    @Put("/user/updatePhone")
    async updatePhone(@Req() req: Request, @Res() res: Response) {
        
        try {
            const { id, phone } = req.body;

            await this.dbAuth.updatePhone(id, phone);

            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }
        
    }

    @Put("/user/updateEmail")
    async updateEmail(@Req() req: Request, @Res() res: Response) {

        try {
            const { id, email } = req.body;

            await this.dbAuth.updateEmail(id, email);

            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }

    }

    @Post("/user/addOrder")
    async postOrder(@Req() req: Request, @Res() res: Response) {

        try {
            const token = req.cookies["refreshToken"];
            const validateToken = await this.tokenService.verifyJwtToken(token);

            const user = validateToken.user;

            const userID = (await this.dbAuth.getUser(user.login)).ID;

            const orders = await this.dbOrder.getOrders();

            for (const element of orders) {
                if (element.UserId === userID) {
                    try {
                        throw new BadRequestException("У вас уже есть заказ! Ожидайте обработки администратором");
                    } catch(e) {
                        res.set("Content-Type", "text/html");
                        res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1><h3>${e.message}</h3>`);
                        return;
                    }
                }
            }

            const { address, products } = req.body;

            const userOrder = await this.dbOrder.checkOrder(userID);

            if (userOrder) {
                await this.dbOrder.changeOrder("Не обработано", userID);
                await this.dbOrder.changeAddress(address, userID);
            }

            let price;

            for(let product of products) {
                switch(product.productType) {
                    case "computer": 
                        price = (await this.dbComputer.getComputer(parseInt(product.productId))).Price;
                        await this.dbOrder.postComputer(userID, parseInt(product.productId), price, address);
                        break;
                    case "cpu":
                        price = (await this.dbCpu.getCPU(parseInt(product.productId))).Price;
                        await this.dbOrder.postCPU(userID, parseInt(product.productId), price, address);
                        break;
                    case "gpu": 
                        price = (await this.dbGpu.getGPU(parseInt(product.productId))).Price;
                        await this.dbOrder.postGPU(userID, parseInt(product.productId), price, address);
                        break;
                    case "ram":
                        price = (await this.dbRam.getRAM(parseInt(product.productId))).Price;
                        await this.dbOrder.postRAM(userID, parseInt(product.productId), price, address);
                        break;
                    case "storageDevice": 
                        price = (await this.dbStorageDevice.getStorageDevice(parseInt(product.productId))).Price;
                        await this.dbOrder.postStorageDevice(userID, parseInt(product.productId), price, address);
                        break;
                    case "laptop": 
                        price = (await this.dbLaptop.getLaptop(parseInt(product.productId))).Price;
                        await this.dbOrder.postLaptop(userID, parseInt(product.productId), price, address);
                        break;
                    default:
                        throw new BadRequestException();
                }
            }


            const shoppingCarts = await this.dbShoppingCart.getCart(userID);

            for (const element of shoppingCarts) {
                await this.dbShoppingCart.deleteCart(element.ID, userID)
            }
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.set("Content-Type", "text/html");
            res.send(`<h1>${res.statusCode} ${res.statusMessage}</h1>`);
        }
    }


}