import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CustomerGenders } from "../customers.const";
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

@InputType()
export class AddCustomerArgs {
  @Field({ nullable: false })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @Field({ nullable: false })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @Field({ nullable: false })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  birthday: string;

  @Field(() => CustomerGenders, { nullable: true })
  @IsOptional()
  @IsEnum(CustomerGenders)
  gender: CustomerGenders;
}
