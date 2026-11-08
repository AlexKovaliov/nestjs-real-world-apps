import { NestFactory } from '@nestjs/core';
import { HrModule } from './hr.module.js';
import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(HrModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 8001,
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001);
}

await bootstrap();
