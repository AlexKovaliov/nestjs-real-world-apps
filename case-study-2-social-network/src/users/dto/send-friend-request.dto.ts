import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { NotSameSenderAndRecipient } from '../validators/not-same-sender-recipient.validator';

@InputType()
export class SendFriendRequestDto {
  @Field()
  @IsMongoId()
  senderId: string;

  @Field()
  @IsMongoId()
  @NotSameSenderAndRecipient('Cannot send a friend request to yourself')
  recipientId: string;
}
