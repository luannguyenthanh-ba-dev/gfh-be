import { registerEnumType } from "@nestjs/graphql";

export enum APP_USERS_NOTIFICATION_SETTINGS_EVENTS {
  BMI_NOTIFICATION = "bmi_notification",
  BMR_NOTIFICATION = "bmr_notification",
  BODY_STATS_NOTIFICATION = "body_stats_notification",
  TDEE_NOTIFICATION = "tdee_notification",
}

// ✅ Register the enum with GraphQL
registerEnumType(APP_USERS_NOTIFICATION_SETTINGS_EVENTS, {
  name: "AppUsersNotificationSettingsEvents", // Name to be used in GraphQL Schema
});
