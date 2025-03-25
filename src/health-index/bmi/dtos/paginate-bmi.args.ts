import { Field, Float, ArgsType } from "@nestjs/graphql";
import { PaginationArgs } from "src/common/utils/constants.util";
import { BMI_CATEGORY } from "../bmi.const";

@ArgsType()
export class PaginateBmiArgs extends PaginationArgs {
  @Field(() => Float, { nullable: true })
  from_height?: number;

  @Field(() => Float, { nullable: true })
  to_height?: number;

  @Field(() => Float, { nullable: true })
  from_weight?: number;

  @Field(() => Float, { nullable: true })
  to_weight?: number;

  @Field(() => Float, { nullable: true })
  from_bmi_value?: number;

  @Field(() => Float, { nullable: true })
  to_bmi_value?: number;

  @Field(() => BMI_CATEGORY, { nullable: true })
  bmi_category?: BMI_CATEGORY;

  @Field(() => Date, { nullable: true })
  from_time?: Date;

  @Field(() => Date, { nullable: true })
  to_time?: Date;
}
