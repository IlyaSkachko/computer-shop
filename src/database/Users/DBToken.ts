
import { DBInit } from "../DBInit";

export class DBToken extends DBInit {

    constructor() {
        super();
    }


    async getToken(refreshToken: string) {
        try {
            const token = await this.prisma.refreshtokens.findFirst({
                where: {
                    Refresh_Token: refreshToken
                }
            })

            return token;
        } catch (err) {
            throw new Error("Auth DB Token Error: " + err);
        }
    }

    async postToken(refreshToken: string, userID: number) {
        try {
            const token = await this.prisma.refreshtokens.create({
                data: {
                    Refresh_Token: refreshToken,
                    UserId: userID
                }
            })

            if (!token) {
                throw new Error();
            }
            return;
        } catch (err) {
            throw new Error("POST Auth DB Token Error: " + err);
        }
    }

    async delToken(refreshToken: string) {
        try {
            const token = await this.prisma.refreshtokens.deleteMany({
                where: {
                    Refresh_Token: refreshToken
                }
            });
        } catch (err) {
            throw new Error("DELETE Auth DB Token Error: " + err);
        }
    }
}
