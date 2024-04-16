
import { DBInit } from "../DBInit";

export class DBStorageDevice extends DBInit {

    async getStorageDevices() {
        const storDev = await this.prisma.storagedevices.findMany();
        return storDev;
    }

}
