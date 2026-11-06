import { Field, ObjectType } from '@nestjs/graphql';
import {
  FriendRequestDirection,
  FriendRequestStatus,
} from '../enums/friend-request.enum';

@ObjectType()
export class FriendRequest {
  @Field()
  userId: string;

  @Field(() => FriendRequestDirection)
  direction: FriendRequestDirection;

  @Field(() => FriendRequestStatus)
  status: FriendRequestStatus;
}
