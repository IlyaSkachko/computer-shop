import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { DBOrder } from "src/database/Orders/DBOrders";

@WebSocketGateway()
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect  {
    @WebSocketServer()
    server: Server;

    private readonly db: DBOrder = new DBOrder();

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage("server")
    async handleEvent(@MessageBody() data, @ConnectedSocket() client) {
        const orders = await this.db.getOrders();

        const id = parseInt(data);

        let message = "Статус заказов: Принято";

        for (const element of orders) {
            if (element.UserId == id) {
                if (element.Status == "Отклонено") {
                    message = "Статус заказов: Отклонено";
                    break;
                } 
            }
        }

        if (message.length > 0) {
            client.emit("client", message);
        }
    }

}