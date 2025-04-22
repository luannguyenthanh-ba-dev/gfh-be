import { Field, ID, ObjectType } from "@nestjs/graphql";
import { NOTIFICATION_TYPES } from "../notification-svc.const";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType({ description: "in-app-notifications" })
export class NotificationSvcInAppNotification {
  @Field((type) => ID, {
    nullable: false,
    description: "In App Notification ID",
  })
  _id: string;

  @Field((type) => String, {
    nullable: false,
    description: "User ID",
  })
  user_id: string;

  @Field((type) => String, {
    nullable: false,
    description: "User Name",
  })
  user_name: string;

  @Field((type) => NOTIFICATION_TYPES, {
    nullable: false,
    description: "Notification Type",
  })
  type: NOTIFICATION_TYPES;

  @Field((type) => String, {
    nullable: false,
    description: "Event",
  })
  event: string;

  @Field((type) => GraphQLJSON, {
    nullable: false,
    description: "Data",
  })
  data: object;

  @Field((type) => Boolean, {
    nullable: false,
    description: "Is Read",
  })
  is_read: boolean;

  @Field((type) => Boolean, {
    nullable: false,
    description: "Is Deleted",
  })
  is_deleted: boolean;

  @Field((type) => Date, {
    nullable: true,
    description: "Read At",
  })
  read_at: Date;

  @Field((type) => Number, {
    nullable: false,
    description: "Created At",
  })
  created_at: Number;

  @Field((type) => Number, {
    nullable: false,
    description: "Updated At",
  })
  updated_at: Number;
}

@ObjectType({ description: "paginated-in-app-notifications" })
export class PaginatedNotificationSvcInAppNotification {
  @Field((type) => [NotificationSvcInAppNotification], {
    nullable: "items",
    description: "Notifications",
  })
  data: NotificationSvcInAppNotification[];

  @Field((type) => Number, {
    nullable: false,
    description: "Total",
  })
  total: number;

  @Field((type) => Number, {
    nullable: false,
    description: "Page",
  })
  page: number;

  @Field((type) => Number, {
    nullable: false,
    description: "Limit",
  })
  limit: number;
}
