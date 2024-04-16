import { PrismaClient } from "@prisma/client";

export class DBInit {
    public readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }


}
