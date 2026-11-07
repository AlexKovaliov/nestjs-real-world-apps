import {
  FriendRequestDirection,
  FriendRequestStatus,
} from '../../enums/friend-request.enum';

export type FriendRequestRecord = {
  userId: string;
  direction: FriendRequestDirection;
  status: FriendRequestStatus;
};
