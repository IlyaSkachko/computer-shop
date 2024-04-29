
import { DBInit } from "../DBInit";

export class DBStorageDevice extends DBInit {

    async setStorageDevice(name, type, frequency, memory, price, image) {
        try {
            if (name.length > 100 || type.length > 100) {
                throw new Error("Too big data");
            }


            await this.prisma.storagedevices.create({
                data: {
                    Name: name,
                    Frequency: parseFloat(frequency),
                    Type: type,
                    Memory: parseFloat(memory),
                    Price: parseFloat(price),
                    Image: image
                }
            })
        } catch (e) {
            console.log(e);
            throw new Error(`[ERROR] Storage Device create: ${e}`);
        }
    }

    async getStorageDevices() {
        const storDev = await this.prisma.storagedevices.findMany();
        return storDev;
    }

    async getFrequency() {
        const frequency = await this.prisma.storagedevices.findMany({
            distinct: ['Frequency'],
            select: {
                Frequency: true
            }
        });

        return frequency.map(storage => storage.Frequency);
    }

    async getMemory() {
        const memory = await this.prisma.storagedevices.findMany({
            distinct: ['Memory'],
            select: {
                Memory: true
            }
        });

        return memory.map(storage => storage.Memory);
    }

    async getType() {
        const type = await this.prisma.storagedevices.findMany({
            distinct: ['Type'],
            select: {
                Type: true
            }
        });

        return type.map(storage => storage.Type);
    }

}
