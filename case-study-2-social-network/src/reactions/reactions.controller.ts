import { Controller, Get } from '@nestjs/common';
import { ReactionsService } from './reactions.service';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get()
  findAll() {
    return this.reactionsService.findAll();
  }
}
