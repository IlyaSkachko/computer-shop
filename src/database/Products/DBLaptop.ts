import { DBInit } from "../DBInit";

export class DBLaptop extends DBInit {

    async getLaptops() {
        const laptops = await this.prisma.laptops.findMany();
        return laptops;
    }
}
