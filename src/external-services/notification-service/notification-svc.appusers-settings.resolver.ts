import { Query, Args, Mutation, Resolver } from "@nestjs/graphql";
import { NotificationSvcService } from "./notification-svc.service";
import { NotificationAppUsersSettings } from "./models/notification-svc.appusers-settings.model";
import { UpdateNotificationAppUsersSettingsArgs } from "./dtos";
import { Users } from "src/auth/users/models/users.model";
import { USER_ROLES, UserProfile } from "src/common/utils/constants.util";
import { ForbiddenException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";

@UseGuards(AuthGuard)
@Resolver((of) => NotificationAppUsersSettings)
export class NotificationSvcAppUsersSettingsResolver {
  constructor(
    private readonly notificationSvcService: NotificationSvcService
  ) {}

  @Query(() => NotificationAppUsersSettings, {
    name: "getNotificationAppUsersSettings",
  })
  async getNotificationAppUsersSettings(
    @UserProfile() actionUser: Partial<Users>
  ) {
    const response = await this.notificationSvcService.getAppUsersSettings(
      actionUser.id
    );
    console.log(typeof response.created_at);
    return JSON.parse(JSON.stringify(response));
  }

  @Mutation(() => NotificationAppUsersSettings, {
    name: "updateNotificationAppUsersSettings",
  })
  async updateNotificationAppUsersSettings(
    @Args("updateNotificationAppUsersSettingsArgs")
    data: UpdateNotificationAppUsersSettingsArgs,
    @UserProfile() actionUser: Partial<Users>
  ) {
    if (
      actionUser.role !== USER_ROLES.SUPER_ADMIN &&
      actionUser.role !== USER_ROLES.ADMIN &&
      actionUser.id !== data.user_id
    ) {
      throw new ForbiddenException(
        "You are not allowed to update this user's settings"
      );
    }
    return this.notificationSvcService.updateAppUsersSettings(data);
  }
}
