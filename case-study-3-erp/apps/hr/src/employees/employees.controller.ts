import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  getEmployees() {
    return this.employeesService.getEmployees();
  }

  @Post()
  createEmployee(@Body() data: Employee) {
    return this.employeesService.createEmployee(data);
  }
}
