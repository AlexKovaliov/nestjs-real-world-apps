import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmployeeEvent } from '@app/events';

@Injectable()
export class PayrollEventsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  onEmployeeCreated(listener: (employee: unknown) => void) {
    this.eventEmitter.on(EmployeeEvent.Created, listener);
  }
}
