import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ProductCurrencies } from "../products.const";

@ObjectType()
export class Products {
  @Field((type) => ID, { nullable: false })
  id: string;

  @Field((type) => String, { nullable: false })
  name: string;

  @Field((type) => Number, { nullable: false })
  price: number;

  @Field((type) => ProductCurrencies, { nullable: false })
  currency: ProductCurrencies;

  @Field((type) => String, { nullable: true })
  brand: string;

  @Field((type) => Number, { nullable: true })
  stock: number;

  @Field((type) => Date, { nullable: false })
  created_at: Date;

  @Field((type) => Date, { nullable: false })
  updated_at: Date;
}
