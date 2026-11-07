import {
  FriendRequestDirection,
  FriendRequestStatus,
} from '../../enums/friend-request.enum';

export function getFriendRequestStatusFlags(status?: FriendRequestStatus) {
  return {
    isPending: status === FriendRequestStatus.Pending,
    isAccepted: status === FriendRequestStatus.Accepted,
    isRejected: status === FriendRequestStatus.Rejected,
    isBlocked: status === FriendRequestStatus.Blocked,
  };
}

export function getFriendRequestDirectionFlags(
  direction?: FriendRequestDirection,
) {
  return {
    isIncoming: direction === FriendRequestDirection.Incoming,
    isOutgoing: direction === FriendRequestDirection.Outgoing,
  };
}
