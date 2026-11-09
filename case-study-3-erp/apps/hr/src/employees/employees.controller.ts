import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EmployeesService } from './employees.service';

@Controller()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @MessagePattern({ cmd: 'create_employee' })
  createEmployee(data: any) {
    return this.employeesService.createEmployee(data);
  }

  @MessagePattern({ cmd: 'get_employee' })
  getEmployee(id: number) {
    return this.employeesService.getEmployee(id);
  }
}
