import { ArgsType, Field } from "@nestjs/graphql";
import { NOTIFICATION_TYPES } from "../notification-svc.const";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

@ArgsType()
export class GetUserInAppNotificationsArgs {
  @Field(() => Boolean, {
    nullable: true,
    description: "Read status",
  })
  @IsBoolean()
  @IsOptional()
  is_read?: boolean;

  @Field(() => NOTIFICATION_TYPES, {
    nullable: true,
    description: "Notification type",
  })
  @IsEnum(NOTIFICATION_TYPES)
  @IsOptional()
  type?: NOTIFICATION_TYPES;

  @Field(() => Number, {
    nullable: true,
    description: "Limit the number of returned records",
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @Field(() => Number, {
    nullable: true,
    description: "Page number",
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @Field(() => String, {
    nullable: true,
    description: "Sort by field",
    defaultValue: "created_at",
  })
  @IsOptional()
  @IsString()
  sort_by?: string;

  @Field(() => Number, {
    nullable: true,
    description: "Sort order",
    defaultValue: -1,
  })
  @IsOptional()
  @IsNumber()
  sort_order?: number;
}
