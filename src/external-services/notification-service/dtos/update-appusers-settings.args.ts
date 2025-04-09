import { Field, InputType } from "@nestjs/graphql";
import { APP_USERS_NOTIFICATION_SETTINGS_EVENTS } from "../notification-svc.const";

@InputType()
export class UpdateNotificationAppUsersSettingsArgs {
  @Field((type) => String, { nullable: false, description: "User ID" })
  user_id: string;

  @Field((type) => String, {
    nullable: true,
    description: "User Email",
  })
  user_email?: string;

  @Field((type) => String, {
    nullable: true,
    description: "User Telegram ID",
  })
  user_telegram_id?: string;

  @Field((type) => String, {
    nullable: true,
    description: "User Phone",
  })
  user_phone?: string;

  @Field((type) => [APP_USERS_NOTIFICATION_SETTINGS_EVENTS], {
    nullable: true,
    description: "AppUsers Event Types",
  })
  event_types?: APP_USERS_NOTIFICATION_SETTINGS_EVENTS[];

  @Field((type) => Boolean, {
    nullable: true,
    description: "In App Notification",
  })
  in_app_notification?: boolean;

  @Field((type) => Boolean, {
    nullable: true,
    description: "Email Notification",
  })
  email_notification?: boolean;

  @Field((type) => Boolean, {
    nullable: true,
    description: "Telegram Notification",
  })
  telegram_notification?: boolean;
}
