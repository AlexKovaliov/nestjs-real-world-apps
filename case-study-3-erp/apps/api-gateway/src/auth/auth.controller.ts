import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

interface LoginBody {
  username?: string;
  password?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginBody) {
    const { username, password } = body ?? {};
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new BadRequestException('username and password are required');
    }

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.authService.login(user);
  }
}
