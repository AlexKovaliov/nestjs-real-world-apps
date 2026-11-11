import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { RateLimiterMiddleware } from './common/middleware/rate-limiter.middleware';

@Module({
  imports: [HttpModule, AuthModule, EventsModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('{*splat}');
  }
}
