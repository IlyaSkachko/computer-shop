
import { DBInit } from "../DBInit";

export class DBComputer extends DBInit {

    async getComputers() {
        const computers = await this.prisma.computers.findMany();
        return computers;
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
