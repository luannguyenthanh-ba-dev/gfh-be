import { Field, ID, InputType } from "@nestjs/graphql";
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { CustomerGenders } from "../customers.const";

@InputType()
export class UpdateCustomerArgs {
  @Field((type) => ID, {
    nullable: false,
    description: "The ID that we will use to find record to MODIFY!",
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  first_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  last_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  birthday?: string;

  @Field(() => CustomerGenders, { nullable: true })
  @IsOptional()
  @IsEnum(CustomerGenders)
  gender?: CustomerGenders;
}
