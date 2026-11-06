import { Field, InputType } from '@nestjs/graphql';
import {
  FriendRequestDirection,
  FriendRequestStatus,
} from '../enums/friend-request.enum';

@InputType()
export class FriendRequestsDto {
  @Field()
  userId: string;

  @Field(() => FriendRequestDirection, { nullable: true })
  direction?: FriendRequestDirection;

  @Field(() => FriendRequestStatus, { nullable: true })
  status?: FriendRequestStatus;
}
