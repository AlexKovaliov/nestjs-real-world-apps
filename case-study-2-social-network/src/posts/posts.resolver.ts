import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './schemas/post.schema';

@Resolver((of) => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query((returns) => [Post])
  async posts() {
    return this.postsService.findAll();
  }

  @Mutation((returns) => Post)
  async createPost(@Args('createPostDto') createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }
}
