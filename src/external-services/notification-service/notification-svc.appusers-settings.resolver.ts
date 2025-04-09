import { Query, Args, Mutation, Resolver } from "@nestjs/graphql";
import { NotificationSvcService } from "./notification-svc.service";
import { NotificationAppUsersSettings } from "./models/notification-svc.appusers-settings.model";
import { UpdateNotificationAppUsersSettingsArgs } from "./dtos";
import { Users } from "src/auth/users/models/users.model";
import { UserProfile } from "src/common/utils/constants.util";
import { UseGuards } from "@nestjs/common";
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
  async getNotificationAppUsersSettings(@UserProfile() user: Partial<Users>) {
    const response = await this.notificationSvcService.getAppUsersSettings(
      user.id
    );
    console.log(typeof response.created_at);
    return JSON.parse(JSON.stringify(response));
  }

  @Mutation(() => NotificationAppUsersSettings, {
    name: "updateNotificationAppUsersSettings",
  })
  async updateNotificationAppUsersSettings(
    @Args("updateNotificationAppUsersSettingsArgs")
    data: UpdateNotificationAppUsersSettingsArgs
  ) {
    return this.notificationSvcService.updateAppUsersSettings(data);
  }
}
