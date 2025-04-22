import { Args, Query, Resolver } from "@nestjs/graphql";
import {
  NotificationSvcInAppNotification,
  PaginatedNotificationSvcInAppNotification,
} from "./models/notification-svc.in-app-notification.model";
import { Users } from "src/auth/users/models/users.model";
import { UserProfile } from "src/common/utils/constants.util";
import { NotificationSvcService } from "./notification-svc.service";
import { GetUserInAppNotificationsArgs } from "./dtos/get-user-in-app-notifications.args";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { UseGuards } from "@nestjs/common";

@Resolver((of) => NotificationSvcInAppNotification)
export class NotificationSvcInAppNotificationResolver {
  constructor(
    private readonly notificationSvcService: NotificationSvcService
  ) {}

  @UseGuards(AuthGuard)
  @Query((returns) => PaginatedNotificationSvcInAppNotification, {
    name: "getUserInAppNotifications",
  })
  async getUserInAppNotifications(
    @Args() args: GetUserInAppNotificationsArgs,
    @UserProfile() user: Users
  ) {
    const result = await this.notificationSvcService.getUserInAppNotifications(
      user.id,
      {
        is_read: args.is_read,
        type: args.type,
        limit: args.limit,
        page: args.page,
        sort_by: args.sort_by,
        sort_order: args.sort_order,
      }
    );
    return result;
  }
}
