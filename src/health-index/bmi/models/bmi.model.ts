import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import { BMI_CATEGORY } from "../bmi.const";
import { Users } from "src/auth/users/models/users.model";

@ObjectType()
export class Bmi {
  @Field((type) => ID, { nullable: false, description: "BMI ID" })
  id: string;

  @Field((type) => Float, { nullable: false })
  height: number;

  @Field((type) => Float, { nullable: false })
  weight: number;

  @Field((type) => Float, { nullable: false })
  bmi_value: number;

  @Field((type) => BMI_CATEGORY, { nullable: false })
  bmi_category: BMI_CATEGORY;

  @Field((type) => ID, { name: "owner_id", nullable: false })
  owner_id: string;

  @Field((type) => Users, { nullable: true })
  owner?: Users;

  @Field((type) => Date)
  created_at: Date;

  @Field((type) => Date)
  updated_at: Date;
}
