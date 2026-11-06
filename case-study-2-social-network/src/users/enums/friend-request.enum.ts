import { registerEnumType } from '@nestjs/graphql';

export enum FriendRequestDirection {
  Incoming = 'incoming',
  Outgoing = 'outgoing',
}

export enum FriendRequestStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Blocked = 'blocked',
}

registerEnumType(FriendRequestDirection, {
  name: 'FriendRequestDirection',
});

registerEnumType(FriendRequestStatus, {
  name: 'FriendRequestStatus',
});
