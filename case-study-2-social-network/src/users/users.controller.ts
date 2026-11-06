import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FriendRequestDirection,
  FriendRequestStatus,
} from './enums/friend-request.enum';
import { FriendRequestsDto } from './dto/friend-requests.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { RespondFriendRequestDto } from './dto/respond-friend-request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId/friend-requests')
  friendRequests(
    @Param('userId') userId: string,
    @Query('direction') direction?: FriendRequestDirection,
    @Query('status') status?: FriendRequestStatus,
  ) {
    const friendRequestsDto: FriendRequestsDto = { userId, direction, status };
    return this.usersService.friendRequests(friendRequestsDto);
  }

  @Post('friend-request/send')
  sendFriendRequest(@Body() sendFriendRequestDto: SendFriendRequestDto) {
    return this.usersService.sendFriendRequest(sendFriendRequestDto);
  }

  @Patch('friend-request/respond')
  respondToFriendRequest(
    @Body() respondFriendRequestDto: RespondFriendRequestDto,
  ) {
    return this.usersService.respondToFriendRequest(respondFriendRequestDto);
  }
}
