import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { APIResponseInterceptor } from './common/interceptors/api-response-interceptor';
import { HttpExceptionFilter } from './common/exception-filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new APIResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Close DB connections cleanly when the host (Docker, PaaS, k8s) sends SIGTERM.
  app.enableShutdownHooks();

  // Hosting platforms usually assign the port through the PORT env variable.
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
