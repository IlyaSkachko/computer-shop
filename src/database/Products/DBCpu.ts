
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
