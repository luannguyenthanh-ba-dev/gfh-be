import { Field, Float, ObjectType } from "@nestjs/graphql";
import { BMI_CATEGORY } from "../bmi.const";

@ObjectType()
export class BmiChartData {
  @Field(() => String, { nullable: false, description: "Date in YYYY-MM-DD format" })
  date: string;

  @Field(() => Float, { nullable: false })
  bmi_value: number;

  @Field(() => BMI_CATEGORY, { nullable: true })
  bmi_category: BMI_CATEGORY;
}
