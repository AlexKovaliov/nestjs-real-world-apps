import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('create')
  async createEmployeePayroll(@Body() employee: any) {
    return this.payrollService.createEmployeePayroll(employee);
  }

  @Get(':employeeId/total')
  async calculateTotal(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.payrollService.calculateTotal(employeeId);
  }
}
