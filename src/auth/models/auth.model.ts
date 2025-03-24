import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LoginResult {
  @Field((type) => String, { description: "JWT TOKEN from Auth0" })
  access_token: string;

  @Field((type) => String, { description: "REFRESH TOKEN from Auth0" })
  refresh_token: string;

  @Field((type) => Int)
  expires_in: number;

  @Field((type) => String)
  token_type: string;
}
