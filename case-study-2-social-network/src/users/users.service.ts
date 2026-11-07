import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { RespondFriendRequestDto } from './dto/respond-friend-request.dto';
import { FriendRequestsDto } from './dto/friend-requests.dto';
import { FriendRequestAssertions } from './policies/friend-request.assertions';
import { FriendRequestPolicy } from './policies/friend-request.policy';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async sendFriendRequest(
    sendFriendRequestDto: SendFriendRequestDto,
  ): Promise<User> {
    const { senderId, recipientId } = sendFriendRequestDto;

    const sender = await this.findUserOrFail(senderId);
    const recipient = await this.findUserOrFail(recipientId);

    const existing = sender.friendRequests.find(
      (request) => request.userId === recipientId,
    );

    FriendRequestAssertions.assertCanSend(existing);
    FriendRequestPolicy.applySend(
      sender.friendRequests,
      recipient.friendRequests,
      senderId,
      recipientId,
      existing,
    );

    await sender.save();
    await recipient.save();

    return sender;
  }

  async respondToFriendRequest(
    respondFriendRequestDto: RespondFriendRequestDto,
  ): Promise<User> {
    const { recipientId, senderId, status } = respondFriendRequestDto;

    const sender = await this.findUserOrFail(senderId);
    const recipient = await this.findUserOrFail(recipientId);

    const senderExisting = FriendRequestPolicy.getUniqueFriendRequest(
      sender.friendRequests,
      recipientId,
      `Friend request from user ${senderId} to user ${recipientId} not found`,
    );
    const recipientExisting = FriendRequestPolicy.getUniqueFriendRequest(
      recipient.friendRequests,
      senderId,
      `Friend request for user ${recipientId} from user ${senderId} not found`,
    );

    FriendRequestAssertions.assertCanRespond(
      senderId,
      senderExisting,
      recipientExisting,
    );

    senderExisting.status = status;
    recipientExisting.status = status;

    await sender.save();
    await recipient.save();

    return sender;
  }

  async friendRequests(friendRequestsDto: FriendRequestsDto) {
    const { direction, status, userId } = friendRequestsDto;

    const user = await this.findUserOrFail(userId);

    return user.friendRequests.filter((request) => {
      const directionMatches = !direction || request.direction === direction;
      const statusMatches = !status || request.status === status;

      return directionMatches && statusMatches;
    });
  }

  async updatePreferences(
    userId: string,
    preferences: Map<string, boolean>,
  ): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { preferences }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return user;
  }

  private async findUserOrFail(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    return user;
  }
}
