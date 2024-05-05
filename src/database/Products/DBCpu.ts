
import { BadRequestException } from "@nestjs/common";
import { DBInit } from "../DBInit";

export class DBCpu extends DBInit {

    async setCPU(name, frequency, cores, cache, price, image) {
        try {
            if (name.length > 100) {
                throw new Error("Too big data");
            }


            await this.prisma.cpus.create({
                data: {
                    Name: name,
                    Frequency: parseFloat(frequency),
                    Cores: parseInt(cores),
                    Cache: parseInt(cache),
                    Price: parseFloat(price),
                    Image: image
                }
            })
        } catch (e) {
            console.log(e);
            throw new Error(`[ERROR] CPU create: ${e}`);
        }
    }


    async getCPU(id) {
        const cpu = await this.prisma.cpus.findFirstOrThrow({
            where: {
                ID: id
            }
        });
        return cpu;
    }

    async getPageCPUs(skip: number, take: number) {

        try {
            const cpus = await this.prisma.cpus.findMany({
                skip,
                take,
            });
            return cpus;
        } catch (e) {
            throw new BadRequestException();
        }
    }

    async deleteCPU(id) {
        const cpu = await this.prisma.cpus.delete({
            where: {
                ID: id
            }
        })
        return cpu;
    }

    async getCPUs() {
        const cpu = await this.prisma.cpus.findMany();
        return cpu;
    }


    async getFrequency() {
        const frequency = await this.prisma.cpus.findMany({
            distinct: ['Frequency'],
            select: {
                Frequency: true
            }
        });

        return frequency.map(cpu => cpu.Frequency);
    }

    async getCores() {
        const cores = await this.prisma.cpus.findMany({
            distinct: ["Cores"],
            select: {
                Cores: true
            }
        });

        return cores.map(cpu => cpu.Cores);
    }

    async getCache() {
        const cache = await this.prisma.cpus.findMany({
            distinct: ["Cache"],
            select: {
                Cache: true
            }
        });

        return cache.map(cpu => cpu.Cache);
    }
}
