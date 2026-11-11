import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

// Shares the gateway's HTTP server (port 3000) and re-broadcasts every
// `update` message to all connected clients.
@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('update')
  handleUpdate(@MessageBody() payload: unknown): void {
    this.server.emit('update', payload);
  }
}
