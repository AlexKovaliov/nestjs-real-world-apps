import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { FriendRequest } from './dto/friend-request.dto';
import { FriendRequestsDto } from './dto/friend-requests.dto';
import { RespondFriendRequestDto } from './dto/respond-friend-request.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Mutation(() => User)
  async createUser(@Args('createUserDto') createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Mutation(() => User)
  async sendFriendRequest(
    @Args('sendFriendRequestDto') sendFriendRequestDto: SendFriendRequestDto,
  ) {
    return this.usersService.sendFriendRequest(sendFriendRequestDto);
  }

  @Mutation(() => User)
  async respondToFriendRequest(
    @Args('respondToFriendRequest')
    respondToFriendRequest: RespondFriendRequestDto,
  ) {
    return this.usersService.respondToFriendRequest(respondToFriendRequest);
  }

  @Query(() => [FriendRequest])
  async friendRequests(
    @Args('friendRequestsDto') friendRequestsDto: FriendRequestsDto,
  ) {
    return this.usersService.friendRequests(friendRequestsDto);
  }
}
