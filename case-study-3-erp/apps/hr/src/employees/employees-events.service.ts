import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmployeeEvent } from '@app/events';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesEventsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  employeeCreated(employee: Employee) {
    this.eventEmitter.emit(EmployeeEvent.Created, employee);
  }
}
