
import { BadRequestException } from "@nestjs/common";
import { DBInit } from "../DBInit";

export class DBOrder extends DBInit {
    
    async getOrders() {
        try {
            const orders = await this.prisma.orders.findMany();
            return orders;
        } catch (error) {
            console.error(error);
        }
    }

    async getPageOrders(skip: number, take: number) {

        try {
            const orders = await this.prisma.orders.findMany({
                skip,
                take,
            });
            return orders;
        } catch (e) {
            throw new BadRequestException();
        }
    }

    async checkOrder(userID) {
        try {
            const orders = await this.prisma.orders.findFirst({
                where: {
                    UserId: userID
                }
            });

            return orders;
        } catch (error) {
            throw new BadRequestException();
        }
    }

    async deleteOrder(userID) {
        try {
            await this.prisma.orders.deleteMany({
                where: {
                    UserId: parseInt(userID)
                }
            })
        } catch (error) {
            throw new Error();
        }
    }

    async changeOrder(status, userId) {
        try {
            await this.prisma.orders.updateMany({
                where: {
                    UserId: parseInt(userId)
                },
                data: {
                    Status: status
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] change status in order: ${error}`);
        }
    }

    async changeAddress(address, userId) {
        try {
            await this.prisma.orders.updateMany({
                where: {
                    UserId: parseInt(userId)
                },
                data: {
                    Address: address
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] change status in order: ${error}`);
        }
    }


    async postComputer(userId: number, computerId: number, price: number, address: string) {
        try {
            await this.prisma.orders.create({
                data: {
                    UserId: userId,
                    ComputerId: computerId,
                    Price: price,
                    Status: "Не обработано",
                    Address: address
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post computer in order: ${error}`);
        }
    }


    async postLaptop(userId: number, laptopId: number, price: number, address: string) {
        try {
            await this.prisma.orders.create({
                data: {
                    UserId: userId,
                    LaptopId: laptopId,
                    Price: price,
                    Status: "Не обработано",
                    Address: address
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post laptop in order: ${error}`);
        }
    }

    async postStorageDevice(userId: number, deviceId: number, price: number, address: string) {
        try {
            await this.prisma.orders.create({
                data: {
                    UserId: userId,
                    StorageDeviceId: deviceId,
                    Price: price,
                    Status: "Не обработано",
                    Address: address
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post storage device in order: ${error}`);
        }
    }

    async postGPU(userId: number, gpuId: number, price: number, address: string) {
        try {
            await this.prisma.orders.create({
                data: {
                    UserId: userId,
                    GPU_ID: gpuId,
                    Price: price,
                    Status: "Не обработано",
                    Address: address
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post GPU in order: ${error}`);
        }
    }

    async postCPU(userId: number, cpuId: number, price: number, address: string) {
        try {
            await this.prisma.orders.create({
                data: {
                    UserId: userId,
                    CPU_ID: cpuId,
                    Price: price,
                    Status: "Не обработано",
                    Address: address
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post CPU in order: ${error}`);
        }
    }

    async postRAM(userId: number, ramId: number, price: number, address: string) {
        try {
            await this.prisma.orders.create({
                data: {
                    UserId: userId,
                    RAM_ID: ramId,
                    Price: price,
                    Status: "Не обработано",
                    Address: address
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post RAM in order: ${error}`);
        }
    }
}