
import { DBInit } from "../DBInit";

export class DBRegistration extends DBInit {

    async getUser(login: string) {
        try {
            const user = await this.prisma.users.findFirst({
                where: {
                    Login: login
                }
            });
            return user;
        } catch (err) {
            throw new Error("Get User Error: " + err);
        }
    }

    async postUser(name: string, surname: string, login: string, password: string, email: string, phone: string) {
        try {

            await this.prisma.users.create({
                data: {
                    Name: name,
                    Surname: surname,
                    Login: login,
                    Password: password,
                    Phone: phone,
                    Email: email
                }
            });

        } catch (err) {
            throw new Error("[Error] Could't created user")
        }
    }
}
