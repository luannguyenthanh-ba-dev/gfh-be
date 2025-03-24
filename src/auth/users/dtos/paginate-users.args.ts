import { ArgsType, Field } from "@nestjs/graphql";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Oder, PaginationArgs, USER_ROLES } from "src/common/utils/constants.util";

@ArgsType()
export class PaginateUsersArgs extends PaginationArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field(() => USER_ROLES, { nullable: true })
  @IsOptional()
  @IsEnum(USER_ROLES)
  role?: USER_ROLES;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  auth0_user_id?: string;
} 