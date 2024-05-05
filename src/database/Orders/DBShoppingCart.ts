
import { DBInit } from "../DBInit";

export class DBShoppingCart extends DBInit {


    async getCart(userId) {
        try {
            const cart = await this.prisma.shoppingcart.findMany({
                where: {
                    UserId: userId
                }
            })

            return cart;
        } catch (error) {
            throw new Error(`[ERROR] GET shopping cart: ${error}`);
        }
    }

    async deleteCart(id: number, userID: number) {
        try {
            await this.prisma.shoppingcart.delete({
                where: {
                    ID: id,
                    UserId: userID
                }
            });
        } catch (error) {
            throw new Error(`[ERROR] delete product in shopping cart: ${error}`);
        }
    }


    async postComputer(userId, computerId, price) {
        try {
            await this.prisma.shoppingcart.create({
                data: {
                    UserId: userId,
                    ComputerId: computerId,
                    Price: price
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post computer in shopping cart : ${error}`);
        }
    }

    async postLaptop(userId, laptopId, price) {
        try {
            await this.prisma.shoppingcart.create({
                data: {
                    UserId: userId,
                    LaptopId: laptopId,
                    Price: price
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post laptop in shopping cart : ${error}`);
        }
    }

    async postStorageDevice(userId, deviceId, price) {
        try {
            await this.prisma.shoppingcart.create({
                data: {
                    UserId: userId,
                    StorageDeviceId: deviceId,
                    Price: price
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post storage device in shopping cart : ${error}`);
        }
    }

    async postGPU(userId, gpuId, price) {
        try {
            await this.prisma.shoppingcart.create({
                data: {
                    UserId: userId,
                    GPU_ID: gpuId,
                    Price: price
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post GPU in shopping cart : ${error}`);
        }
    }

    async postCPU(userId, cpuId, price) {
        try {
            await this.prisma.shoppingcart.create({
                data: {
                    UserId: userId,
                    CPU_ID: cpuId,
                    Price: price
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post CPU in shopping cart : ${error}`);
        }
    }

    async postRAM(userId, ramId, price) {
        try {
            await this.prisma.shoppingcart.create({
                data: {
                    UserId: userId,
                    RAM_ID: ramId,
                    Price: price
                }
            })
        } catch (error) {
            throw new Error(`[ERROR] Post RAM in shopping cart : ${error}`);
        }
    }

}