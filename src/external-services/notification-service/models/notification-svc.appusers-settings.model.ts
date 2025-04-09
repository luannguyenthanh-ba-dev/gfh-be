import { Field, ID, ObjectType } from "@nestjs/graphql";
import { APP_USERS_NOTIFICATION_SETTINGS_EVENTS } from "../notification-svc.const";

@ObjectType()
export class NotificationAppUsersSettings {
  @Field((type) => ID, {
    nullable: false,
    description: "AppUsers Setting ID",
  })
  _id: string;

  @Field((type) => String, { nullable: false, description: "User ID" })
  user_id: string;

  @Field((type) => String, { nullable: false, description: "User Email" })
  user_email: string;

  @Field((type) => String, { nullable: true, description: "User Phone" })
  user_phone: string;

  @Field((type) => String, { nullable: true, description: "User Telegram ID" })
  user_telegram_id: string;

  @Field((type) => [APP_USERS_NOTIFICATION_SETTINGS_EVENTS], {
    nullable: false,
    description: "AppUsers Event Types",
  })
  event_types: string[];

  @Field((type) => Boolean, {
    nullable: false,
    description: "In App Notification",
  })
  in_app_notification: boolean;

  @Field((type) => Boolean, {
    nullable: false,
    description: "Email Notification",
  })
  email_notification: boolean;

  @Field((type) => Boolean, {
    nullable: false,
    description: "Telegram Notification",
  })
  telegram_notification: boolean;

  @Field((type) => Number, {
    nullable: false,
    description: "Created At - Unix Timestamp",
  })
  created_at: Number;

  @Field((type) => Number, {
    nullable: false,
    description: "Updated At - Unix Timestamp",
  })
  updated_at: Number;
}
