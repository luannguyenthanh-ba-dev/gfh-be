import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Products } from "./products.model";

@ObjectType()
export class PaginatedProducts {
  @Field((type) => [Products], { nullable: "items" })
  items: Products[];

  @Field((type) => Int)
  total: number;

  @Field((type) => Int)
  page: number;

  @Field((type) => Int)
  limit: number;
}
