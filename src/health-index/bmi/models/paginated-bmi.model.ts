import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Bmi } from "./bmi.model";

@ObjectType()
export class PaginatedBmi {
  @Field((type) => [Bmi], { nullable: "items" })
  items: Bmi[];

  @Field((type) => Int)
  total: number;

  @Field((type) => Int)
  page: number;

  @Field((type) => Int)
  limit: number;
}
