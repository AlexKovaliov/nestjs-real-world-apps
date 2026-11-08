import { Body, Controller, Post } from '@nestjs/common';
import { PayrollService } from './payroll.service';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('create')
  async createEmployeePayroll(@Body() employee: any) {
    return this.payrollService.createEmployeePayroll(employee);
  }
}
