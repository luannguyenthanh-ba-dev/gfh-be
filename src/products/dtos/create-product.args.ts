import { Field, Float, InputType, Int } from "@nestjs/graphql";
import { ProductCurrencies } from "../products.const";

@InputType()
export class CreateProductArgs {
  @Field((type) => String, { nullable: false })
  name: string;

  @Field((type) => Float, { nullable: false })
  price: number;

  @Field((type) => ProductCurrencies, { nullable: false })
  currency: ProductCurrencies;

  @Field((type) => String, { nullable: false })
  brand: string;

  @Field((type) => Int, { nullable: false })
  stock: number;
}
