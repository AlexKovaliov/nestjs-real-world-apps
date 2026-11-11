import { Injectable } from '@nestjs/common';
import { Employee } from './entities/employee.entity';
import { EmployeesEventsService } from './employees-events.service';

@Injectable()
export class EmployeesService {
  // an in-memory database - simulating a database per service   // architecture
  private readonly employees: Employee[] = [];

  constructor(private readonly events: EmployeesEventsService) {}

  createEmployee(employee: Employee) {
    this.employees.push(employee);
    this.events.employeeCreated(employee);
    return employee;
  }

  getEmployees() {
    return this.employees;
  }

  getEmployee(id: number) {
    // return null (not undefined) so the TCP client always receives a reply
    return this.employees.find((emp) => emp.id === id) ?? null;
  }
}
