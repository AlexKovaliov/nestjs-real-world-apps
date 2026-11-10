import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PayrollEventsService } from './payroll-events.service';

@Injectable()
export class PayrollService implements OnModuleInit {
  private readonly logger = new Logger(PayrollService.name);
  private readonly client: ClientProxy;

  constructor(private readonly events: PayrollEventsService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.HR_HOST ?? '127.0.0.1',
        port: Number(process.env.HR_PORT ?? 3001),
      },
    });
  }

  onModuleInit() {
    this.events.onEmployeeCreated((employee) => {
      void this.createEmployeePayroll(employee).catch((error) => {
        this.logger.error('Failed to create employee payroll', error);
      });
    });
  }

  async createEmployeePayroll(employee: any) {
    return firstValueFrom(
      this.client.send({ cmd: 'create_employee' }, employee),
    );
  }
}
