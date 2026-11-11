import { io } from 'socket.io-client';
import { NotificationService } from './notification.service';

const socket = { on: vi.fn(), disconnect: vi.fn() };

vi.mock('socket.io-client', () => ({ io: vi.fn(() => socket) }));

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new NotificationService();
  });

  it('connects to the gateway and handles update events', () => {
    const handleUpdate = vi.spyOn(service, 'handleUpdate');

    service.onModuleInit();

    expect(io).toHaveBeenCalledWith('http://localhost:3000');
    expect(socket.on).toHaveBeenCalledWith('update', expect.any(Function));

    const listener = socket.on.mock.calls[0][1] as (data: unknown) => void;
    listener({ employeeId: 1 });
    expect(handleUpdate).toHaveBeenCalledWith({ employeeId: 1 });
  });

  it('disconnects on module destroy', () => {
    service.onModuleInit();
    service.onModuleDestroy();

    expect(socket.disconnect).toHaveBeenCalled();
  });
});
