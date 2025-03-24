import { ArgsType, Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { PaginationArgs } from "src/common/utils/constants.util";

@ArgsType()
export class PaginateCustomersArgs extends PaginationArgs {
  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  email?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  search?: string;
}
