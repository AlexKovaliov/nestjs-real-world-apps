import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@ObjectType()
@Schema()
export class Notification extends Document {
  @Field()
  @Prop({ required: true })
  message: string;

  @Field()
  @Prop({ required: true })
  category: string;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Field(() => ID)
  @Prop({ type: String, ref: 'User', required: true })
  recipient: User;

  @Field()
  @Prop({ type: Boolean, default: false })
  read: boolean;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
