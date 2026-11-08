import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import type { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  // inject the httpService
  constructor(private readonly httpService: HttpService) {}

  async handleRequest(
    req: Request,
    res: Response,
    endpoint: string,
    method: 'get' | 'post' | 'put' | 'delete',
    serviceUrl: string,
  ) {
    const route = `${serviceUrl}/${endpoint}`;

    try {
      const request$ =
        method === 'get' || method === 'delete'
          ? this.httpService[method](route)
          : this.httpService[method](route, req.body);
      const response: AxiosResponse = await lastValueFrom(request$);
      res.status(response.status).json(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      res
        .status(axiosError.response?.status ?? 500)
        .json(axiosError.response?.data ?? axiosError.message);
    }
  }
}
