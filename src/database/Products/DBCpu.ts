
import { DBInit } from "../DBInit";

export class DBCpu extends DBInit {

    async getCPUs() {
        const cpu = await this.prisma.cpus.findMany();
        return cpu;
    }

}
