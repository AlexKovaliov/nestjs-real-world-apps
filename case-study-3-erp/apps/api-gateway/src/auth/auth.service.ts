import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export interface AuthUser {
  userId: number;
  username: string;
}

interface StoredUser extends AuthUser {
  salt: string;
  passwordHash: Buffer;
}

const hashPassword = (password: string, salt: string) =>
  scryptSync(password, salt, 64);

const createUser = (
  userId: number,
  username: string,
  password: string,
): StoredUser => {
  const salt = randomBytes(16).toString('hex');
  return { userId, username, salt, passwordHash: hashPassword(password, salt) };
};

@Injectable()
export class AuthService {
  // In-memory demo users. Replace with a real user store in production.
  private readonly users: StoredUser[] = [
    createUser(1, 'admin', process.env.ADMIN_PASSWORD ?? 'changeme'),
  ];

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<AuthUser | null> {
    const user = this.users.find((u) => u.username === username);
    if (!user) {
      return null;
    }

    const candidate = hashPassword(pass, user.salt);
    if (!timingSafeEqual(candidate, user.passwordHash)) {
      return null;
    }

    return { userId: user.userId, username: user.username };
  }

  async login(user: AuthUser) {
    const payload = {
      username: user.username,
      sub: user.userId,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
