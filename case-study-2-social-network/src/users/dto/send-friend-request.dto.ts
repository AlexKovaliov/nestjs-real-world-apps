import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class SendFriendRequestDto {
  @Field()
  @IsMongoId()
  senderId: string;

  @Field()
  @IsMongoId()
  recipientId: string;
}
