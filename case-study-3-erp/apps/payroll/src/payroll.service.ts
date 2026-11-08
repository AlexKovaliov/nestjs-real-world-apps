import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PayrollService {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3001,
      },
    });
  }

  async createEmployeePayroll(employee: any) {
    const result = await firstValueFrom(
      this.client.send({ cmd: 'create_employee' }, employee),
    );
    // Further payroll processing logic here
    return result;
  }
}
