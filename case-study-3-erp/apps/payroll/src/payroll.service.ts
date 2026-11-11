import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
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

  // Synchronous communication: ask HR for the latest employee data and
  // wait for the reply before calculating anything.
  async calculateTotal(employeeId: number) {
    const employee = await firstValueFrom(
      this.client
        .send<EmployeeSnapshot | null>({ cmd: 'get_employee' }, employeeId)
        .pipe(timeout(HR_REQUEST_TIMEOUT_MS)),
      { defaultValue: null },
    );

    if (!employee) {
      throw new NotFoundException(`Employee ${employeeId} not found`);
    }

    // Calculate the monthly payroll amount
    const gross = round(employee.salary / 12);
    const tax = round(gross * TAX_RATE);

    return {
      employeeId: employee.id,
      name: employee.name,
      gross,
      tax,
      net: round(gross - tax),
    };
  }
}

const HR_REQUEST_TIMEOUT_MS = 5000;
const TAX_RATE = 0.2;

const round = (value: number) => Math.round(value * 100) / 100;

interface EmployeeSnapshot {
  id: number;
  name: string;
  salary: number;
}
