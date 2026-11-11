import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  private readonly hrServiceUrl = 'http://localhost:3001';

  constructor(private readonly appService: AppService) {}

  @All(['hr', 'hr/*path'])
  @UseGuards(JwtAuthGuard)
  handleHrRequest(@Req() req: Request, @Res() res: Response) {
    const endpoint = req.path.replace(/^\/hr\/?/, '');
    const method = req.method.toLowerCase() as
      'get' | 'post' | 'put' | 'delete';

    return this.appService.handleRequest(
      req,
      res,
      endpoint,
      method,
      this.hrServiceUrl,
    );
  }
}
