import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class LoginUserDto extends PickType(CreateUserDto, [
  'username',
  'password',
] as const) {}
