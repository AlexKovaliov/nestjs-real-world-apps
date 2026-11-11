import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationService } from './notifications/notification.service';
import { PayrollController } from './payroll.controller';
import { PayrollEventsService } from './payroll-events.service';
import { PayrollService } from './payroll.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [PayrollController],
  providers: [PayrollService, PayrollEventsService, NotificationService],
})
export class PayrollModule {}
