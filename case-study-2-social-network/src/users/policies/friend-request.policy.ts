import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  FriendRequestDirection,
  FriendRequestStatus,
} from '../enums/friend-request.enum';
import { FriendRequestRecord } from '../domain/friend-request/friend-request.types';

export type { FriendRequestRecord };

export class FriendRequestPolicy {
  static applySend(
    senderFriendRequests: FriendRequestRecord[],
    recipientFriendRequests: FriendRequestRecord[],
    senderId: string,
    recipientId: string,
    existing?: FriendRequestRecord,
  ): void {
    if (existing?.status === FriendRequestStatus.Rejected) {
      this.reopenRejectedRequest(existing, recipientFriendRequests, senderId);
      return;
    }

    this.createPendingRequests(
      senderFriendRequests,
      recipientFriendRequests,
      senderId,
      recipientId,
    );
  }

  private static reopenRejectedRequest(
    existing: FriendRequestRecord,
    recipientFriendRequests: FriendRequestRecord[],
    senderId: string,
  ): void {
    existing.status = FriendRequestStatus.Pending;
    existing.direction = FriendRequestDirection.Outgoing;

    const incoming = recipientFriendRequests.find(
      (request) => request.userId === senderId,
    );

    if (incoming) {
      incoming.status = FriendRequestStatus.Pending;
      incoming.direction = FriendRequestDirection.Incoming;
      return;
    }

    recipientFriendRequests.push({
      userId: senderId,
      direction: FriendRequestDirection.Incoming,
      status: FriendRequestStatus.Pending,
    });
  }

  private static createPendingRequests(
    senderFriendRequests: FriendRequestRecord[],
    recipientFriendRequests: FriendRequestRecord[],
    senderId: string,
    recipientId: string,
  ): void {
    senderFriendRequests.push({
      userId: recipientId,
      direction: FriendRequestDirection.Outgoing,
      status: FriendRequestStatus.Pending,
    });

    recipientFriendRequests.push({
      userId: senderId,
      direction: FriendRequestDirection.Incoming,
      status: FriendRequestStatus.Pending,
    });
  }

  static getUniqueFriendRequest(
    friendRequests: FriendRequestRecord[],
    userId: string,
    notFoundMessage: string,
  ): FriendRequestRecord {
    const matches = friendRequests.filter(
      (request) => request.userId === userId,
    );

    if (matches.length > 1) {
      throw new BadRequestException(
        'Multiple friend request records found for the same user',
      );
    }

    const existing = matches[0];
    if (!existing) {
      throw new NotFoundException(notFoundMessage);
    }

    return existing;
  }
}
