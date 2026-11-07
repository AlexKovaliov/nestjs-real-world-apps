import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsMongoId } from 'class-validator';
import { FriendRequestStatus } from '../enums/friend-request.enum';
import { NotSameSenderAndRecipient } from '../validators/not-same-sender-recipient.validator';

@InputType()
export class RespondFriendRequestDto {
  @Field()
  @IsMongoId()
  senderId: string;

  @Field()
  @IsMongoId()
  @NotSameSenderAndRecipient(
    'Cannot respond to a friend request to yourself',
  )
  recipientId: string;

  @Field(() => FriendRequestStatus)
  @IsIn([FriendRequestStatus.Accepted, FriendRequestStatus.Rejected])
  status: FriendRequestStatus.Accepted | FriendRequestStatus.Rejected;
}
