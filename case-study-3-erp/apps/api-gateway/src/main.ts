import type { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as fs from 'node:fs';
import { AppModule } from './app.module';

// Enable HTTPS when both TLS files are configured, otherwise fall back to HTTP
// so local development works without certificates.
function getHttpsOptions(): NestApplicationOptions['httpsOptions'] {
  const keyPath = process.env.TLS_KEY_PATH;
  const certPath = process.env.TLS_CERT_PATH;

  if (!keyPath || !certPath) {
    return undefined;
  }

  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

async function bootstrap() {
  const httpsOptions = getHttpsOptions();
  const app = await NestFactory.create(AppModule, { httpsOptions });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
