import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@ObjectType()
@Schema()
export class Post extends Document {
  @Field()
  @Prop({ type: String, required: true })
  content: string;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Field()
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Field(() => ID)
  @Prop({ type: String, ref: 'User', required: true })
  author: User;
}
export const PostSchema = SchemaFactory.createForClass(Post);
