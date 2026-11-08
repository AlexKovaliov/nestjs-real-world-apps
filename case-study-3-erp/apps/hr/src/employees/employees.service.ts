import { Injectable } from '@nestjs/common';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  // an in-memory database - simulating a database per service   // architecture
  private readonly employees: Employee[] = [];

  createEmployee(employee: Employee) {
    this.employees.push(employee);
    return employee;
  }

  getEmployees() {
    return this.employees;
  }

  getEmployee(id: number) {
    return this.employees.find((emp) => emp.id === id);
  }
}
