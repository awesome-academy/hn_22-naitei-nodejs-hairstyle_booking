import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, Logger } from "@nestjs/common";
import { Notification } from "@prisma/client";
import { NotificationWithUnreadCount } from "src/common/types/notification.interface";

@Injectable()
@WebSocketGateway({ cors: { origin: "*" } })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationGateway.name);

  sendToUser(userId: string, notification: NotificationWithUnreadCount) {
    this.server.to(userId).emit("new_notification", notification);
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      this.logger.warn(`Client tried to connect without userId: ${client.id}`);
      client.disconnect();
      return;
    }
    client.join(userId);
    this.logger.log(`Client connected: ${client.id}, joined room: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    this.logger.log("Notification Gateway initialized");
  }
}
