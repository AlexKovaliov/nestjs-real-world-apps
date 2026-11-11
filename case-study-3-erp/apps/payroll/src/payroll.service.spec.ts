import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EMPTY, of } from 'rxjs';
import { PayrollEventsService } from './payroll-events.service';
import { PayrollService } from './payroll.service';

describe('PayrollService', () => {
  let service: PayrollService;
  let send: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayrollService,
        {
          provide: PayrollEventsService,
          useValue: { onEmployeeCreated: vi.fn() },
        },
      ],
    }).compile();

    service = module.get<PayrollService>(PayrollService);
    // replace the real TCP client's send with a stub
    send = vi.fn();
    (service as unknown as { client: { send: typeof send } }).client.send =
      send;
  });

  it('should request the employee from HR and calculate the total', async () => {
    send.mockReturnValue(of({ id: 1, name: 'Alice', salary: 60000 }));

    await expect(service.calculateTotal(1)).resolves.toEqual({
      employeeId: 1,
      name: 'Alice',
      gross: 5000,
      tax: 1000,
      net: 4000,
    });
    expect(send).toHaveBeenCalledWith({ cmd: 'get_employee' }, 1);
  });

  it('should throw NotFoundException when HR returns no employee', async () => {
    send.mockReturnValue(of(null));

    await expect(service.calculateTotal(99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw NotFoundException when HR replies with no value', async () => {
    send.mockReturnValue(EMPTY);

    await expect(service.calculateTotal(99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
