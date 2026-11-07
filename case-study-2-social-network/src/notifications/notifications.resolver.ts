import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { NotificationsService } from './notifications.service';
import { Notification } from './schemas/notification.schema';
import { User } from '../users/schemas/user.schema';

interface NotificationAddedPayload {
  notification: Notification;
}

interface SubscriptionContext {
  user: User;
}

const pubSub = new PubSub<{
  notificationAdded: NotificationAddedPayload;
}>();

@Resolver()
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Subscription(() => Notification, {
    filter: (
      payload: NotificationAddedPayload,
      _variables: Record<string, unknown>,
      context: SubscriptionContext,
    ) => {
      const userPreferences = context.user.preferences;
      return userPreferences.get(payload.notification.category) === true;
    },
  })
  notificationAdded() {
    return pubSub.asyncIterableIterator('notificationAdded');
  }
}
