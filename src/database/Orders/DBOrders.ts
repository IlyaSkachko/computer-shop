
import { DBInit } from "../DBInit";

export class DBOrder extends DBInit {
    
    async getOrders() {
        try {
            const orders = await this.prisma.orders.findMany(
            );
            return orders;
        } catch (error) {
            // Обработка ошибок
            console.error(error);
        }


    }

}