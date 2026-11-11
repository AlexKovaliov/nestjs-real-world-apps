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

  beforeAll(() => {
    process.env.JWT_SECRET ??= 'e2e-test-secret';
  });

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

  const login = async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'changeme' })
      .expect(200);
    return res.body.access_token as string;
  };

  it('/auth/login (POST) rejects invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrong' })
      .expect(401);
  });

  it('/hr/employees (GET) without a token is rejected', () => {
    return request(app.getHttpServer()).get('/hr/employees').expect(401);
  });

  it('/hr/employees (GET) with a valid token', async () => {
    httpService.get.mockReturnValue(
      of({
        status: 200,
        data: [],
      }),
    );

    const token = await login();

    return request(app.getHttpServer())
      .get('/hr/employees')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect([]);
  });

  afterEach(async () => {
    await app.close();
  });
});
