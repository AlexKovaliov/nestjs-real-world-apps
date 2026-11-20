import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_BYTES = 32;
const IV_BYTES = 12;
const AUTH_TAG_BYTES = 16;
const FORMAT_VERSION = 'v1';
const HEX_KEY_PATTERN = /^[0-9a-fA-F]{64}$/;

type EncryptedParts = {
  iv: Buffer;
  authTag: Buffer;
  ciphertext: Buffer;
};

@Injectable()
export class EncryptionService {
  private readonly key: Buffer;

  constructor(private readonly configService: ConfigService) {
    const hexKey = this.configService.getOrThrow<string>('ENCRYPTION_KEY');
    this.key = this.parseHexKey(hexKey);
  }

  private toBase64(value: Buffer): string {
    return value.toString('base64');
  }

  private fromBase64(value: string): Buffer {
    return Buffer.from(value, 'base64');
  }

  private fromUtf8(value: string): Buffer {
    return Buffer.from(value, 'utf8');
  }

  private fromHex(value: string): Buffer {
    return Buffer.from(value, 'hex');
  }

  private toUtf8(value: Buffer): string {
    return value.toString('utf8');
  }

  private concatBuffers(...chunks: Buffer[]): Buffer {
    return Buffer.concat(chunks);
  }

  private parseHexKey(hexKey: string): Buffer {
    const isInvalidHexKey = !HEX_KEY_PATTERN.test(hexKey);
    if (isInvalidHexKey) {
      throw new Error(
        'ENCRYPTION_KEY must be 32 bytes encoded as 64 hex characters',
      );
    }

    const key = this.fromHex(hexKey);
    const hasInvalidKeyLength = key.length !== KEY_BYTES;
    if (hasInvalidKeyLength) {
      throw new Error('ENCRYPTION_KEY must be 32 bytes');
    }

    return key;
  }

  private serialize({ iv, authTag, ciphertext }: EncryptedParts): string {
    return [
      FORMAT_VERSION,
      this.toBase64(iv),
      this.toBase64(authTag),
      this.toBase64(ciphertext),
    ].join(':');
  }

  private parse(payload: string): EncryptedParts {
    const [version, ivB64, tagB64, dataB64, ...extra] = payload.split(':');

    const hasInvalidVersion = version !== FORMAT_VERSION;
    const isMissingIv = ivB64 === undefined;
    const isMissingAuthTag = tagB64 === undefined;
    const isMissingCiphertext = dataB64 === undefined;
    const hasExtraParts = extra.length > 0;
    const hasInvalidFormat =
      hasInvalidVersion ||
      isMissingIv ||
      isMissingAuthTag ||
      isMissingCiphertext ||
      hasExtraParts;

    if (hasInvalidFormat) {
      throw new Error('Invalid ciphertext format');
    }

    const iv = this.fromBase64(ivB64);
    const authTag = this.fromBase64(tagB64);
    const ciphertext = this.fromBase64(dataB64);

    const hasInvalidIvLength = iv.length !== IV_BYTES;
    const hasInvalidAuthTagLength = authTag.length !== AUTH_TAG_BYTES;
    const hasInvalidPartLengths = hasInvalidIvLength || hasInvalidAuthTagLength;

    if (hasInvalidPartLengths) {
      throw new Error('Invalid ciphertext format');
    }

    return { iv, authTag, ciphertext };
  }

  encrypt(plaintext: string, associatedData?: string): string {
    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv(ALGORITHM, this.key, iv, {
      authTagLength: AUTH_TAG_BYTES,
    });

    const hasAssociatedData = associatedData !== undefined;
    if (hasAssociatedData) {
      cipher.setAAD(this.fromUtf8(associatedData));
    }

    const encryptedChunk = cipher.update(plaintext, 'utf8');
    const finalChunk = cipher.final();
    const ciphertext = this.concatBuffers(encryptedChunk, finalChunk);
    const authTag = cipher.getAuthTag();

    return this.serialize({ iv, authTag, ciphertext });
  }

  decrypt(payload: string, associatedData?: string): string {
    const { iv, authTag, ciphertext } = this.parse(payload);

    const decipher = createDecipheriv(ALGORITHM, this.key, iv, {
      authTagLength: AUTH_TAG_BYTES,
    });
    decipher.setAuthTag(authTag);

    const hasAssociatedData = associatedData !== undefined;
    if (hasAssociatedData) {
      decipher.setAAD(this.fromUtf8(associatedData));
    }

    const decryptedChunk = decipher.update(ciphertext);
    const finalChunk = decipher.final();
    const plaintext = this.concatBuffers(decryptedChunk, finalChunk);

    return this.toUtf8(plaintext);
  }
}
