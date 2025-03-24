import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Users } from "./users.model";

@ObjectType()
export class PaginatedUsers {
  @Field(() => [Users], { nullable: "items" })
  items: Users[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}
