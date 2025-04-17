import { Field, InputType } from "@nestjs/graphql";
import { APP_USERS_NOTIFICATION_SETTINGS_EVENTS } from "../notification-svc.const";
import { IsArray, IsDefined, IsEnum, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, IsBoolean, IsTimeZone } from "class-validator";
@InputType()
export class UpdateNotificationAppUsersSettingsArgs {
  @Field((type) => String, { nullable: false, description: "User ID" })
  @IsNotEmpty()
  @IsUUID()
  @IsDefined()
  user_id: string;

  @Field((type) => String, {
    nullable: true,
    description: "User Email",
  })
  @IsOptional()
  @IsEmail()
  user_email?: string;

  @Field((type) => String, {
    nullable: true,
    description: "User Telegram ID",
  })
  @IsOptional()
  @IsString()
  user_telegram_id?: string;

  @Field((type) => String, {
    nullable: true,
    description: "User Phone",
  })
  @IsOptional()
  @IsString()
  user_phone?: string;

  @Field((type) => [APP_USERS_NOTIFICATION_SETTINGS_EVENTS], {
    nullable: true,
    description: "AppUsers Event Types",
  })
  @IsOptional()
  @IsArray()
  @IsEnum(APP_USERS_NOTIFICATION_SETTINGS_EVENTS, {
    each: true,
  })
  event_types?: APP_USERS_NOTIFICATION_SETTINGS_EVENTS[];

  @Field((type) => Boolean, {
    nullable: true,
    description: "In App Notification",
  })
  @IsOptional()
  @IsBoolean()
  in_app_notification?: boolean;

  @Field((type) => Boolean, {
    nullable: true,
    description: "Email Notification",
  })
  @IsOptional()
  @IsBoolean()
  email_notification?: boolean;

  @Field((type) => Boolean, {
    nullable: true,
    description: "Telegram Notification",
  })
  @IsOptional()
  @IsBoolean()
  telegram_notification?: boolean;

  @Field((type) => String, {
    nullable: true,
    description: "Timezone",
  })
  @IsOptional()
  @IsTimeZone()
  timezone?: string;
}
