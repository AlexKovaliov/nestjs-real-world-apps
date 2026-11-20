import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'node:crypto';
import { EncryptionService } from './encryption.service';

// ESM-only package: mock so plain `jest` (IDE) works without --experimental-vm-modules.
jest.mock('@nestjs/config', () => ({
  ConfigService: class {
    constructor(private readonly env: Record<string, string> = {}) {}

    getOrThrow(key: string): string {
      const value = this.env[key];
      if (value === undefined) {
        throw new Error(`Configuration key "${key}" does not exist`);
      }
      return value;
    }
  },
}));

const createService = (key?: string) =>
  new EncryptionService(
    new ConfigService(key === undefined ? {} : { ENCRYPTION_KEY: key }),
  );

const tamper = (payload: string, index: number) => {
  const parts = payload.split(':');
  const bytes = Buffer.from(parts[index], 'base64');
  bytes[0] ^= 0x01;
  parts[index] = bytes.toString('base64');
  return parts.join(':');
};

describe('EncryptionService', () => {
  const key = randomBytes(32).toString('hex');
  let service: EncryptionService;

  beforeEach(() => {
    service = createService(key);
  });

  it('round-trips plaintext, including unicode and empty strings', () => {
    for (const text of ['hello', '', 'Hello, world 🔐', 'x'.repeat(10_000)]) {
      expect(service.decrypt(service.encrypt(text))).toBe(text);
    }
  });

  it('produces the v1:iv:tag:data format', () => {
    const [version, iv, tag] = service.encrypt('secret').split(':');
    expect(version).toBe('v1');
    expect(Buffer.from(iv, 'base64')).toHaveLength(12);
    expect(Buffer.from(tag, 'base64')).toHaveLength(16);
  });

  it('uses a fresh IV, so equal plaintexts give different ciphertexts', () => {
    expect(service.encrypt('same')).not.toBe(service.encrypt('same'));
  });

  it('does not leak the plaintext into the payload', () => {
    expect(service.encrypt('card-4111111111111111')).not.toContain('4111');
  });

  it.each([
    ['IV', 1],
    ['auth tag', 2],
    ['ciphertext', 3],
  ])('rejects a tampered %s', (_, index) => {
    const payload = service.encrypt('{"role":"user"}');
    expect(() => service.decrypt(tamper(payload, index))).toThrow();
  });

  it('decrypts only with the same AAD', () => {
    const payload = service.encrypt('a@example.com', 'users:1:email');
    expect(service.decrypt(payload, 'users:1:email')).toBe('a@example.com');
    expect(() => service.decrypt(payload, 'users:2:email')).toThrow();
    expect(() => service.decrypt(payload)).toThrow();
  });

  it('fails with a different key', () => {
    const payload = service.encrypt('secret');
    const other = createService(randomBytes(32).toString('hex'));
    expect(() => other.decrypt(payload)).toThrow();
  });

  it.each(['plain', 'v2:a:b:c', 'v1:a:b', 'v1:AAAA:AAAA:AAAA'])(
    'rejects malformed payload %p',
    (payload) => {
      expect(() => service.decrypt(payload)).toThrow(
        'Invalid ciphertext format',
      );
    },
  );

  it.each([
    ['missing', undefined],
    ['too short', 'abcd'],
    ['not hex', 'z'.repeat(64)],
  ])('refuses to start when the key is %s', (_, badKey) => {
    expect(() => createService(badKey)).toThrow();
  });
});
