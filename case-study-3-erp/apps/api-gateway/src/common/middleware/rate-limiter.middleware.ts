import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { rateLimit } from 'express-rate-limit';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  // Build the limiter once: it keeps its hit counts in an in-memory store,
  // so creating it per request would reset the count and never block anyone.
  private readonly limiter: RequestHandler = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-8', // send RateLimit-* headers
    legacyHeaders: false, // drop X-RateLimit-* headers
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.limiter(req, res, next);
  }
}
