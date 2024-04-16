
import { DBInit } from "../DBInit";

export class DBRam extends DBInit {

    async getRAMs() {
        const ram = await this.prisma.rams.findMany();
        return ram;
    }

}
