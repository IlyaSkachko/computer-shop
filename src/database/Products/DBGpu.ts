
import { DBInit } from "../DBInit";

export class DBGpu extends DBInit {

    async getGPUs() {
        const gpu = await this.prisma.gpus.findMany();
        return gpu;
    }

}
