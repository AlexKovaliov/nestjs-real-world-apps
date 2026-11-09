import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { EmployeesController } from './employees/employees.controller';
import { EmployeesService } from './employees/employees.service';
import { EmployeesEventsService } from './employees/employees-events.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [HrController, EmployeesController],
  providers: [HrService, EmployeesService, EmployeesEventsService],
})
export class HrModule {}
