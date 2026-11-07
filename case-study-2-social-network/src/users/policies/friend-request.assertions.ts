import { BadRequestException } from '@nestjs/common';
import {
  getFriendRequestDirectionFlags,
  getFriendRequestStatusFlags,
} from '../domain/friend-request/friend-request.flags';
import { FriendRequestRecord } from '../domain/friend-request/friend-request.types';

export class FriendRequestAssertions {
  static assertCanSend(existing?: FriendRequestRecord): void {
    this.assertSendDirection(existing);
    this.assertSendStatus(existing);
  }

  static assertCanRespond(
    senderId: string,
    senderExisting: FriendRequestRecord,
    recipientExisting: FriendRequestRecord,
  ): void {
    this.assertRespondDirections(senderId, senderExisting, recipientExisting);
    this.assertRespondStatuses(senderExisting, recipientExisting);
  }

  private static assertSendDirection(existing?: FriendRequestRecord): void {
    const status = getFriendRequestStatusFlags(existing?.status);
    if (!status.isPending) {
      return;
    }

    const direction = getFriendRequestDirectionFlags(existing?.direction);

    if (direction.isOutgoing) {
      throw new BadRequestException('Friend request already sent');
    }

    if (direction.isIncoming) {
      throw new BadRequestException('This user already sent you a request');
    }
  }

  private static assertSendStatus(existing?: FriendRequestRecord): void {
    const status = getFriendRequestStatusFlags(existing?.status);

    if (status.isAccepted) {
      throw new BadRequestException('Users are already friends');
    }

    if (status.isBlocked) {
      throw new BadRequestException('Friend request is blocked');
    }
  }

  private static assertRespondDirections(
    senderId: string,
    senderExisting: FriendRequestRecord,
    recipientExisting: FriendRequestRecord,
  ): void {
    const senderDirection = getFriendRequestDirectionFlags(
      senderExisting.direction,
    );
    const recipientDirection = getFriendRequestDirectionFlags(
      recipientExisting.direction,
    );

    if (senderDirection.isIncoming && recipientDirection.isOutgoing) {
      throw new BadRequestException(
        'Cannot accept or reject your own outgoing friend request',
      );
    }

    if (senderDirection.isIncoming) {
      throw new BadRequestException(
        `User ${senderId} did not send this friend request`,
      );
    }

    if (recipientDirection.isOutgoing) {
      throw new BadRequestException(
        'Cannot accept or reject your own outgoing friend request',
      );
    }
  }

  private static assertRespondStatuses(
    senderExisting: FriendRequestRecord,
    recipientExisting: FriendRequestRecord,
  ): void {
    const senderStatus = getFriendRequestStatusFlags(senderExisting.status);
    const recipientStatus = getFriendRequestStatusFlags(
      recipientExisting.status,
    );

    if (senderStatus.isBlocked || recipientStatus.isBlocked) {
      throw new BadRequestException('Friend request is blocked');
    }

    if (senderExisting.status !== recipientExisting.status) {
      throw new BadRequestException('Friend request records do not match');
    }

    if (senderStatus.isAccepted) {
      throw new BadRequestException('Friend request is already accepted');
    }

    if (senderStatus.isRejected) {
      throw new BadRequestException('Friend request is already rejected');
    }
  }
}
