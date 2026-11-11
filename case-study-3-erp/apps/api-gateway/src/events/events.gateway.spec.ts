import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'socket.io';
import { EventsGateway } from './events.gateway';

describe('EventsGateway', () => {
  let gateway: EventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsGateway],
    }).compile();

    gateway = module.get(EventsGateway);
  });

  it('broadcasts update payloads to all clients', () => {
    const emit = vi.fn();
    gateway.server = { emit } as unknown as Server;
    const payload = { employeeId: 1, status: 'updated' };

    gateway.handleUpdate(payload);

    expect(emit).toHaveBeenCalledWith('update', payload);
  });
});
