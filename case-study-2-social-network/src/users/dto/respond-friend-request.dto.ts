import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsMongoId } from 'class-validator';
import { FriendRequestStatus } from '../enums/friend-request.enum';

@InputType()
export class RespondFriendRequestDto {
  @Field()
  @IsMongoId()
  senderId: string;

  @Field()
  @IsMongoId()
  recipientId: string;

  @Field(() => FriendRequestStatus)
  @IsIn([FriendRequestStatus.Accepted, FriendRequestStatus.Rejected])
  status: FriendRequestStatus.Accepted | FriendRequestStatus.Rejected;
}
