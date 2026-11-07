import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'node:path';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      subscriptions: {
        'graphql-ws': {
          onConnect: (context) => {
            // Handle connection
          },
          onDisconnect: (context) => {
            // Handle disconnection
          },
        },
      },
    }),
    MongooseModule.forRoot('mongodb://localhost/nectme'),
    UsersModule,
    PostsModule,
    CommentsModule,
    ReactionsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
