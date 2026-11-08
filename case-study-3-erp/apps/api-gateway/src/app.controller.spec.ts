import { Test, TestingModule } from '@nestjs/testing';
import type { Request, Response } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: { handleRequest: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    appService = {
      handleRequest: vi.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('hr proxy', () => {
    it('should forward hr requests to the HR service', () => {
      const req = {
        path: '/hr/employees',
        method: 'GET',
      } as Request;
      const res = {} as Response;

      appController.handleHrRequest(req, res);

      expect(appService.handleRequest).toHaveBeenCalledWith(
        req,
        res,
        'employees',
        'get',
        'http://localhost:3001',
      );
    });
  });
});
