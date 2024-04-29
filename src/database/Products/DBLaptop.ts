import { DBInit } from "../DBInit";

export class DBLaptop extends DBInit {

    async setLaptop(name, model, cpu, gpu, ram, price, image, hdd?, ssd?) {
        try {

            if (name.length > 150 || model.length > 150 || cpu.length > 50 || gpu.length > 50 || ram.length > 50 || hdd.length > 50 || ssd.length > 50) {
                throw new Error("Too big data");
            }
            await this.prisma.laptops.create({
                data: {
                    Name: name,
                    Model: model,
                    CPU: cpu,
                    GPU: gpu,
                    RAM: ram,
                    Price: parseFloat(price),
                    Image: image,
                    HDD: hdd,
                    SSD: ssd
                }
            })
        } catch (e) {
            console.log(e);
            throw new Error(`[ERROR] Laptop create: ${e}`);
        }
    }

    async getLaptops() {
        const laptops = await this.prisma.laptops.findMany();
        return laptops;
    }

    async getLaptopCpus() {
        const uniqueCPUs = await this.prisma.laptops.findMany({
            distinct: ['CPU'],
            select: {
                CPU: true
            }
        });

        return uniqueCPUs.map(laptop => laptop.CPU);
    }


    async getLaptopGpus() {
        const uniqueGPUs = await this.prisma.laptops.findMany({
            distinct: ['GPU'],
            select: {
                GPU: true
            }
        });

        return uniqueGPUs.map(laptop => laptop.GPU);
    }

    async getLaptopRams() {
        const uniqueRAMs = await this.prisma.laptops.findMany({
            distinct: ['RAM'],
            select: {
                RAM: true
            }
        });

        return uniqueRAMs.map(laptop => laptop.RAM);
    }

    async getLaptopHDDs() {
        const uniqueHDDs = await this.prisma.laptops.findMany({
            distinct: ['HDD'],
            select: {
                HDD: true
            }
        });

        return uniqueHDDs.map(laptop => laptop.HDD);
    }
    async getLaptopSSDs() {
        const uniqueSSDs = await this.prisma.laptops.findMany({
            distinct: ['SSD'],
            select: {
                SSD: true
            }
        });

        const filteredSSDs = uniqueSSDs.filter(laptop => laptop.SSD !== null && laptop.SSD !== '');

        return filteredSSDs.map(laptop => laptop.SSD)
    }
}
