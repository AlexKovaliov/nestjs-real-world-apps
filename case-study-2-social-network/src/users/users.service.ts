import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { RespondFriendRequestDto } from './dto/respond-friend-request.dto';
import { FriendRequestsDto } from './dto/friend-requests.dto';
import {
  FriendRequestDirection,
  FriendRequestStatus,
} from './enums/friend-request.enum';

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

    if (senderId === recipientId) {
      throw new BadRequestException('Cannot send a friend request to yourself');
    }

    const sender = await this.userModel.findById(senderId).exec();
    if (!sender) {
      throw new NotFoundException(`User ${senderId} not found`);
    }

    const recipient = await this.userModel.findById(recipientId).exec();
    if (!recipient) {
      throw new NotFoundException(`User ${recipientId} not found`);
    }

    const existing = sender.friendRequests.find(
      (request) => request.userId === recipientId,
    );

    if (
      existing?.status === FriendRequestStatus.Pending &&
      existing.direction === FriendRequestDirection.Outgoing
    ) {
      throw new BadRequestException('Friend request already sent');
    }

    if (
      existing?.status === FriendRequestStatus.Pending &&
      existing.direction === FriendRequestDirection.Incoming
    ) {
      throw new BadRequestException('This user already sent you a request');
    }

    if (existing?.status === FriendRequestStatus.Accepted) {
      throw new BadRequestException('Users are already friends');
    }

    if (existing?.status === FriendRequestStatus.Blocked) {
      throw new BadRequestException('Friend request is blocked');
    }

    if (existing?.status === FriendRequestStatus.Rejected) {
      existing.status = FriendRequestStatus.Pending;
      existing.direction = FriendRequestDirection.Outgoing;

      const incoming = recipient.friendRequests.find(
        (request) => request.userId === senderId,
      );

      if (incoming) {
        incoming.status = FriendRequestStatus.Pending;
        incoming.direction = FriendRequestDirection.Incoming;
      } else {
        recipient.friendRequests.push({
          userId: senderId,
          direction: FriendRequestDirection.Incoming,
          status: FriendRequestStatus.Pending,
        });
      }
    } else {
      sender.friendRequests.push({
        userId: recipientId,
        direction: FriendRequestDirection.Outgoing,
        status: FriendRequestStatus.Pending,
      });

      recipient.friendRequests.push({
        userId: senderId,
        direction: FriendRequestDirection.Incoming,
        status: FriendRequestStatus.Pending,
      });
    }

    await sender.save();
    await recipient.save();

    return sender;
  }

  async respondToFriendRequest(
    respondFriendRequestDto: RespondFriendRequestDto,
  ): Promise<User> {
    const { recipientId, senderId, status } = respondFriendRequestDto;

    if (senderId === recipientId) {
      throw new BadRequestException(
        'Cannot respond to a friend request to yourself',
      );
    }

    if (
      ![FriendRequestStatus.Accepted, FriendRequestStatus.Rejected].includes(
        status,
      )
    ) {
      throw new BadRequestException(
        'Friend request can only be accepted or rejected',
      );
    }

    const sender = await this.userModel.findById(senderId).exec();
    if (!sender) {
      throw new NotFoundException(`User ${senderId} not found`);
    }

    const recipient = await this.userModel.findById(recipientId).exec();
    if (!recipient) {
      throw new NotFoundException(`User ${recipientId} not found`);
    }

    const senderRequests = sender.friendRequests.filter(
      (request) => request.userId === recipientId,
    );

    if (senderRequests.length > 1) {
      throw new BadRequestException(
        'Multiple friend request records found for the same user',
      );
    }

    const senderExisting = senderRequests[0];

    if (!senderExisting) {
      throw new NotFoundException(
        `Friend request from user ${senderId} to user ${recipientId} not found`,
      );
    }

    const recipientRequests = recipient.friendRequests.filter(
      (request) => request.userId === senderId,
    );

    if (recipientRequests.length > 1) {
      throw new BadRequestException(
        'Multiple friend request records found for the same user',
      );
    }

    const recipientExisting = recipientRequests[0];

    if (!recipientExisting) {
      throw new NotFoundException(
        `Friend request for user ${recipientId} from user ${senderId} not found`,
      );
    }

    if (
      senderExisting.direction === FriendRequestDirection.Incoming &&
      recipientExisting.direction === FriendRequestDirection.Outgoing
    ) {
      throw new BadRequestException(
        'Cannot accept or reject your own outgoing friend request',
      );
    }

    if (senderExisting.direction === FriendRequestDirection.Incoming) {
      throw new BadRequestException(
        `User ${senderId} did not send this friend request`,
      );
    }

    if (recipientExisting.direction === FriendRequestDirection.Outgoing) {
      throw new BadRequestException(
        'Cannot accept or reject your own outgoing friend request',
      );
    }

    if (
      senderExisting.status === FriendRequestStatus.Blocked ||
      recipientExisting.status === FriendRequestStatus.Blocked
    ) {
      throw new BadRequestException('Friend request is blocked');
    }

    if (senderExisting.status !== recipientExisting.status) {
      throw new BadRequestException('Friend request records do not match');
    }

    if (senderExisting.status === FriendRequestStatus.Accepted) {
      throw new BadRequestException('Friend request is already accepted');
    }

    if (senderExisting.status === FriendRequestStatus.Rejected) {
      throw new BadRequestException('Friend request is already rejected');
    }

    senderExisting.status = status;
    recipientExisting.status = status;

    await sender.save();
    await recipient.save();

    return sender;
  }

  async friendRequests(friendRequestsDto: FriendRequestsDto) {
    const { direction, status, userId } = friendRequestsDto;

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return user.friendRequests.filter((request) => {
      const directionMatches = !direction || request.direction === direction;
      const statusMatches = !status || request.status === status;

      return directionMatches && statusMatches;
    });
  }
}
