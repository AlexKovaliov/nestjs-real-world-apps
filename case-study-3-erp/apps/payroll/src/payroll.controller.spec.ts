import { Test, TestingModule } from '@nestjs/testing';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';

describe('PayrollController', () => {
  let payrollController: PayrollController;
  let payrollService: { createEmployeePayroll: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    payrollService = {
      createEmployeePayroll: vi.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [PayrollController],
      providers: [{ provide: PayrollService, useValue: payrollService }],
    }).compile();

    payrollController = app.get<PayrollController>(PayrollController);
  });

  it('should be defined', () => {
    expect(payrollController).toBeDefined();
  });

  it('should create employee payroll', async () => {
    const employee = { id: 1, name: 'Alice' };
    payrollService.createEmployeePayroll.mockResolvedValue(employee);

    await expect(
      payrollController.createEmployeePayroll(employee),
    ).resolves.toEqual(employee);
    expect(payrollService.createEmployeePayroll).toHaveBeenCalledWith(employee);
  });
});
