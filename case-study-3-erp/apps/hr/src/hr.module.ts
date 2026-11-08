import { Module } from '@nestjs/common';
import { HrController } from './hr.controller.js';
import { HrService } from './hr.service.js';

@Module({
  imports: [],
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}
