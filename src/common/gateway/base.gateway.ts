import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class BaseGateway {
  @WebSocketServer() server: Server;

  emitToSocketId<T>(socketId: string, eventName: string, data: T) {
    this.server.to(socketId).emit(eventName, data);
  }

  emitToRoom<T>(roomId: string, eventName: string, data: T) {
    this.server.to(roomId).emit(eventName, data);
  }

  broadcastToRoom<T>(socket, roomId: string, eventName: string, data: T) {
    socket.broadcast.to(roomId).emit(eventName, data);
  }

  async getSocket(roomId, socketId) {
    const sockets = await this.server.sockets.in(roomId).fetchSockets();

    return sockets.find((socket) => socket.id === socketId);
  }
}
