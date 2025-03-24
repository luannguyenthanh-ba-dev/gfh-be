import { Field, ID, InputType } from "@nestjs/graphql";
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { USER_ROLES } from "src/common/utils/constants.util";

@InputType()
export class UpdateUserInfoArgs {
  @Field((type) => ID, { description: "The ID of user", nullable: false })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  id?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  first_name?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  last_name?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  address?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  birthday?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  picture?: string;

  @Field((type) => USER_ROLES, { nullable: true })
  @IsEnum(USER_ROLES)
  @IsOptional()
  role?: USER_ROLES;
}
