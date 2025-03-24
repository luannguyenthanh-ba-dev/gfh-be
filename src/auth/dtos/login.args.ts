import { InputType, Field } from "@nestjs/graphql";
import { IsDefined, IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

@InputType()
export class LoginArgs {
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
}
