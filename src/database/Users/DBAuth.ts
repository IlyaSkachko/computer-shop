
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

    async getUserById(id: number) {
        try {
            const user = await this.prisma.users.findFirst({
                where: {
                    ID: id
                }
            });
            return user;
        } catch (err) {
            throw new Error("Auth DB User Error: " + err);
        }
    }

    async updatePhone(id, phone) {
        try {
            const user = await this.prisma.users.findFirst({
                where: {
                    ID: id
                }
            });

            if (user) {
                await this.prisma.users.update({
                    where: {
                        ID: id
                    },
                    data: {
                        Phone: phone
                    }
                });
            } else {
                throw new Error("User does not exist");
            }
        } catch (err) {
            throw new Error("Update phone User Error: " + err);
        }
    }

    async updateEmail(id, email) {
        try {
            const user = await this.prisma.users.findFirst({
                where: {
                    ID: id
                }
            });

            if (user) {
                await this.prisma.users.update({
                    where: {
                        ID: id
                    },
                    data: {
                        Email: email
                    }
                });
            } else {
                throw new Error("User does not exist");
            }
        } catch (err) {
            throw new Error("Update email User Error: " + err);
        }
    }
}
