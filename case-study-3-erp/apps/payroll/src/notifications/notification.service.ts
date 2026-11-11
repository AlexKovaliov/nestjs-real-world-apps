import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

// Connects to the API gateway's WebSocket server and listens for updates.
@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationService.name);
  private socket?: Socket;

  onModuleInit() {
    this.socket = io(process.env.GATEWAY_WS_URL ?? 'http://localhost:3000');
    this.socket.on('update', (data: unknown) => this.handleUpdate(data));
  }

  onModuleDestroy() {
    this.socket?.disconnect();
  }

  handleUpdate(data: unknown) {
    // Handle real-time update
    this.logger.log(`Received update: ${JSON.stringify(data)}`);
  }
}
