import { Field, InputType } from "@nestjs/graphql";
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

@InputType()
export class RegisterNewUserArgs {
  @Field((type) => String, { nullable: false })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  first_name: string;

  @Field((type) => String, { nullable: false })
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  last_name: string;

  @Field((type) => String, { nullable: false })
  @IsNotEmpty()
  @IsDefined()
  @IsEmail()
  email: string;

  @Field((type) => String, { nullable: false })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(8)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#@$%&?]{8,24}$/
  )
  password: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  birthday?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  picture?: string;
}
