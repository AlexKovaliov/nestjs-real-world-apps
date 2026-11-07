import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './schemas/post.schema';
import { PubSub } from 'graphql-subscriptions';

interface PostAddedPayload {
  postAdded: Post;
}

const pubSub = new PubSub<{
  postAdded: PostAddedPayload;
}>();

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [Post])
  async posts() {
    return this.postsService.findAll();
  }

  @Mutation(() => Post)
  async createPost(@Args('createPostDto') createPostDto: CreatePostDto) {
    const post = await this.postsService.create(createPostDto);
    await pubSub.publish('postAdded', { postAdded: post });
    return post;
  }

  @Subscription(() => Post)
  postAdded() {
    return pubSub.asyncIterableIterator('postAdded');
  }
}
