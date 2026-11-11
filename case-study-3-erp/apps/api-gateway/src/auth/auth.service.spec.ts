import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const jwtService = new JwtService({ secret: 'unit-test-secret' });
  const authService = new AuthService(jwtService);

  it('validates a user with correct credentials', async () => {
    await expect(
      authService.validateUser('admin', 'changeme'),
    ).resolves.toEqual({ userId: 1, username: 'admin' });
  });

  it('rejects a wrong password or unknown user', async () => {
    await expect(authService.validateUser('admin', 'nope')).resolves.toBeNull();
    await expect(
      authService.validateUser('ghost', 'changeme'),
    ).resolves.toBeNull();
  });

  it('signs a JWT containing username and sub', async () => {
    const { access_token } = await authService.login({
      userId: 1,
      username: 'admin',
    });

    const payload = await jwtService.verifyAsync(access_token);
    expect(payload).toMatchObject({ username: 'admin', sub: 1 });
  });
});
