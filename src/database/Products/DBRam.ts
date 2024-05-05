
import { BadRequestException } from "@nestjs/common";
import { DBInit } from "../DBInit";

export class DBRam extends DBInit {


    async setRAM(name, type, frequency, memory, typePort, price, image) {
        try {

            if (name.length > 100 || type.length > 100 || typePort.length > 30) {
                throw new Error("Too big data");
            }

            await this.prisma.rams.create({
                data: {
                    Name: name,
                    Frequency: parseFloat(frequency),
                    Type: type,
                    Memory: parseFloat(memory),
                    Price: parseFloat(price),
                    TypePort: typePort,
                    Image: image
                }
            })
        } catch (e) {
            console.log(e);
            throw new Error(`[ERROR] RAM create: ${e}`);
        }
    }

    async deleteRAM(id) {
        const ram = await this.prisma.rams.delete({
            where: {
                ID: id
            }
        })
        return ram;
    }

    async getRAM(id) {
        const ram = await this.prisma.rams.findFirstOrThrow({
            where: {
                ID: id
            }
        });
        return ram;
    }

    async getRAMs() {
        const ram = await this.prisma.rams.findMany();
        return ram;
    }

    async getPageRAMs(skip: number, take: number) {

        try {
            const rams = await this.prisma.rams.findMany({
                skip,
                take,
            });
            return rams;
        } catch (e) {
            throw new BadRequestException();
        }
    }


    async getFrequency() {
        const frequency = await this.prisma.rams.findMany({
            distinct: ['Frequency'],
            select: {
                Frequency: true
            }
        });

        return frequency.map(ram => ram.Frequency);
    }

    async getMemory() {
        const memory = await this.prisma.rams.findMany({
            distinct: ['Memory'],
            select: {
                Memory: true
            }
        });

        return memory.map(ram => ram.Memory);
    }

    async getType() {
        const type = await this.prisma.rams.findMany({
            distinct: ['Type'],
            select: {
                Type: true
            }
        });

        return type.map(ram => ram.Type);
    }


    async getTypePort() {
        const type = await this.prisma.rams.findMany({
            distinct: ['TypePort'],
            select: {
                TypePort: true
            }
        });

        return type.map(ram => ram.TypePort);
    }
}
