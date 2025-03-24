import { Field, ID, ObjectType } from "@nestjs/graphql";
import { USER_ROLES } from "src/common/utils/constants.util";

@ObjectType({ description: "users" })
export class Users {
  @Field((type) => ID, { nullable: false, description: "ID" })
  id: string;

  @Field({ nullable: false })
  first_name: string;

  @Field({ nullable: false })
  last_name: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  phone: string;

  @Field((type) => String, { nullable: true })
  birthday: string;

  @Field((type) => USER_ROLES, { nullable: false })
  role: USER_ROLES;

  @Field((type) => String, { nullable: true })
  picture: string;

  @Field((type) => Date, { nullable: false })
  created_at: Date;

  @Field((type) => Date, { nullable: false })
  updated_at: Date;
}
