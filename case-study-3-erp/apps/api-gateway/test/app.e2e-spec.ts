import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { of } from 'rxjs';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { HttpService } from '@nestjs/axios';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const httpService = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(httpService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/hr/employees (GET)', () => {
    httpService.get.mockReturnValue(
      of({
        status: 200,
        data: [],
      }),
    );

    return request(app.getHttpServer())
      .get('/hr/employees')
      .expect(200)
      .expect([]);
  });

  afterEach(async () => {
    await app.close();
  });
});
