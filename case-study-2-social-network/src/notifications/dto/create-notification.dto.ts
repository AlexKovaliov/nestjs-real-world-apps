import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNotificationDto {
  @Field()
  message: string;

  @Field()
  recipientId: string;
}
