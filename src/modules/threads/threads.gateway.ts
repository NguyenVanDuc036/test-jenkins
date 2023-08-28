import {
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ThreadService } from './threads.service';
import { OnModuleDestroy } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class ThreadGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
{
  constructor(private readonly threadService: ThreadService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('create-thread')
  async handleCreateThread(client: Socket, payload: any) {
    const { detailThread, fileReceives, user_id } = payload;
    const thread = await this.threadService.createThread(
      detailThread,
      fileReceives,
      user_id,
    );
    this.server.emit('receive-thread', thread);
  }

  handleConnection(client: Socket, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
  handleDisconnect(client: Socket) {
    throw new Error('Method not implemented.');
  }
  onModuleDestroy() {
    throw new Error('Method not implemented.');
  }
}
