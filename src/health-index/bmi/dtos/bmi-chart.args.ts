import { ArgsType, Field } from "@nestjs/graphql";
import { BmiChartType } from "../bmi.const";
import {
  IsEnum,
  IsOptional,
  IsDateString,
  IsString,
} from "class-validator";

@ArgsType()
export class BMIChartArgs {
  @Field(() => BmiChartType, { nullable: true })
  @IsOptional()
  @IsEnum(BmiChartType)
  type?: BmiChartType;

  @Field(() => String, { nullable: true, description: "Format: YYYY-MM-DD" })
  @IsOptional()
  @IsDateString()
  from_date?: string;

  @Field(() => String, { nullable: true, description: "Format: YYYY-MM-DD" })
  @IsOptional()
  @IsDateString()
  to_date?: string;

  @Field(() => String, { nullable: true, defaultValue: "Asia/Ho_Chi_Minh" })
  @IsOptional()
  @IsString()
  timezone?: string;
}
