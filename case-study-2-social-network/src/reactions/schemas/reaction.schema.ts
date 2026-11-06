import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Post } from '../../posts/schemas/post.schema';

@ObjectType()
@Schema()
export class Reaction extends Document {
  @Field()
  @Prop({
    type: String,
    required: true,
    enum: ['LIKE', 'UPVOTE'],
  })
  type: string;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Field(() => ID)
  @Prop({ type: String, ref: 'User', required: true })
  user: User;

  @Field(() => ID)
  @Prop({ type: String, ref: 'Post', required: true })
  post: Post;
}
export const ReactionSchema = SchemaFactory.createForClass(Reaction);
