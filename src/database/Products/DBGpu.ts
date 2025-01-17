
import { BadRequestException } from "@nestjs/common";
import { DBInit } from "../DBInit";

export class DBGpu extends DBInit {

    async setGPU(name, frequency, memory, price, image) {
        try {
            if (name.length > 100) {
                throw new Error("Too big data");
            }
            await this.prisma.gpus.create({
                data: {
                    Name: name,
                    Frequency: parseFloat(frequency),
                    Memory: parseFloat(memory),
                    Price: parseFloat(price),
                    Image: image
                }
            })
        } catch (e) {
            console.log(e);
            throw new Error(`[ERROR] GPU create: ${e}`);
        }
    }

    async getGPU(id) {
        const gpu = await this.prisma.gpus.findFirstOrThrow({
            where: {
                ID: id
            }
        });
        return gpu;
    }

    async getPageGPUs(skip: number, take: number) {

        try {
            const gpus = await this.prisma.gpus.findMany({
                skip,
                take,
            });
            return gpus;
        } catch (e) {
            throw new BadRequestException();
        }
    }

    async deleteGPU(id) {
        const gpu = await this.prisma.gpus.delete({
            where: {
                ID: id
            }
        })
        return gpu;
    }

    async getGPUs() {
        const gpu = await this.prisma.gpus.findMany();
        return gpu;
    }


    async getFrequency() {
        const frequency = await this.prisma.gpus.findMany({
            distinct: ['Frequency'],
            select: {
                Frequency: true
            }
        });

        return frequency.map(gpu => gpu.Frequency);
    }

    async getMemory() {
        const memory = await this.prisma.gpus.findMany({
            distinct: ['Memory'],
            select: {
                Memory: true
            }
        });

        return memory.map(gpu => gpu.Memory);
    }
}
