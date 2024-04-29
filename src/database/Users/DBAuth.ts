
import { DBInit } from "../DBInit";

export class DBAuth extends DBInit {

    constructor() {
        super();
    }


    async getUser(login: string) {
        try {
            const user = await this.prisma.users.findFirst({
                where: {
                    Login: login
                }
            });
            return user;
        } catch (err) {
            throw new Error("Auth DB User Error: " + err);
        }
    }
}
