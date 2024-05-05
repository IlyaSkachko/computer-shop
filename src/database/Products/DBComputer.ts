
import { BadRequestException } from "@nestjs/common";
import { DBInit } from "../DBInit";

export class DBComputer extends DBInit {


    async setComputer(name, cpu, gpu, ram, price, image, hdd?, ssd?) {
        try {

            if (name.length > 150 || cpu.length > 50 || gpu.length > 50 || ram.length > 50 || hdd.length > 50 || ssd.length > 50) {
                throw new Error("Too Big Data");
            }

            await this.prisma.computers.create({
                data: {
                    Name: name,
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
            throw new Error(`[ERROR] Computer create: ${e}`);
        }
    }

    async getComputer(id) {
        const computer = await this.prisma.computers.findFirst({
            where: {
                ID: id
            }
        })
        return computer;
    }

    async deleteComputer(id) {
        const computer = await this.prisma.computers.delete({
            where: {
                ID: id
            }
        })
        return computer;
    }

    async getComputers() {
        const computers = await this.prisma.computers.findMany();
        return computers;
    }

    async getPageComputers(skip: number, take: number) {

        try {
        const computers = await this.prisma.computers.findMany({
            skip,
            take,
        });
        return computers;
        } catch(e) {
            throw new BadRequestException();
        } 
    }


    async getComputerCpus() {
        const uniqueCPUs = await this.prisma.computers.findMany({
            distinct: ['CPU'],
            select: {
                CPU: true
            }
        });

        return uniqueCPUs.map(computer => computer.CPU);
    }


    async getComputerGpus() {
        const uniqueGPUs = await this.prisma.computers.findMany({
            distinct: ['GPU'],
            select: {
                GPU: true
            }
        });

        return uniqueGPUs.map(computer => computer.GPU);
    }

    async getComputerRams() {
        const uniqueRAMs = await this.prisma.computers.findMany({
            distinct: ['RAM'],
            select: {
                RAM: true
            }
        });

        return uniqueRAMs.map(computer => computer.RAM);
    }

    async getComputerHDDs() {
        const uniqueHDDs = await this.prisma.computers.findMany({
            distinct: ['HDD'],
            select: {
                HDD: true
            }
        });

        return uniqueHDDs.map(computer => computer.HDD);
    }
    async getComputerSSDs() {
        const uniqueSSDs = await this.prisma.computers.findMany({
            distinct: ['SSD'],
            select: {
                SSD: true
            }
        });

        const filteredSSDs = uniqueSSDs.filter(computer => computer.SSD !== null && computer.SSD !== '');
        
        return filteredSSDs.map(computer => computer.SSD)
    }

}
