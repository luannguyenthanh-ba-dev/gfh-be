import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { CustomerGenders } from "../customers.const";

@ObjectType({ description: "customers" })
export class Customers {
  @Field((type) => ID, { nullable: false, description: "ID" })
  id: string;

  @Field({ nullable: false })
  first_name: string;

  @Field({ nullable: false })
  last_name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  phone: string;

  @Field((type) => String, { nullable: true })
  birthday: string;

  @Field((type) => CustomerGenders, { nullable: true })
  gender: CustomerGenders;

  @Field({ nullable: false })
  created_at: Date;

  @Field({ nullable: false })
  updated_at: Date;
}

@ObjectType({ description: "paginated customers result" })
export class PaginatedCustomers {
  @Field((type) => [Customers], { nullable: "items" })
  data: Customers[];

  @Field((type) => Int, { nullable: false, defaultValue: 0 })
  total: number;
}
