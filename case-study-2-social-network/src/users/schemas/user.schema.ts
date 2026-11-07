import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FriendRequest } from '../dto/friend-request.dto';
import {
  FriendRequestDirection,
  FriendRequestStatus,
} from '../enums/friend-request.enum';

@ObjectType()
@Schema()
export class User extends Document {
  @Field()
  @Prop({ required: true, unique: true })
  username: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field({ nullable: true })
  @Prop()
  bio?: string;

  @Prop({ type: Map, of: Boolean, default: {} })
  preferences: Map<string, boolean>;

  @Field(() => GraphQLISODateTime)
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Prop({ default: Date.now })
  updatedAt: Date;

  @Field(() => [FriendRequest])
  @Prop({
    type: [
      {
        userId: { type: String, required: true },
        direction: {
          type: String,
          enum: FriendRequestDirection,
          required: true,
        },
        status: {
          type: String,
          enum: FriendRequestStatus,
          required: true,
        },
      },
    ],
    default: [],
  })
  friendRequests: {
    userId: string;
    direction: FriendRequestDirection;
    status: FriendRequestStatus;
  }[];
}
export const UserSchema = SchemaFactory.createForClass(User);
