import { Field, Float, ArgsType } from "@nestjs/graphql";
import { PaginationArgs } from "src/common/utils/constants.util";
import { BMI_CATEGORY } from "../bmi.const";
import { IsNumber, IsOptional, Min, Max, IsEnum, IsDate } from "class-validator";
@ArgsType()
export class PaginateBmiArgs extends PaginationArgs {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.5, { message: 'Height must be at least 0.5 meters' })
  @Max(3, { message: 'Height cannot exceed 3 meters' })
  from_height?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0.5, { message: 'Height must be at least 0.5 meters' })
  @Max(3, { message: 'Height cannot exceed 3 meters' })
  to_height?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Weight must be at least 1 kg' })
  @Max(500, { message: 'Weight cannot exceed 500 kg' })
  from_weight?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Weight must be at least 1 kg' })
  @Max(500, { message: 'Weight cannot exceed 500 kg' })
  to_weight?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'BMI value must be at least 0' })
  @Max(50, { message: 'BMI value cannot exceed 50' })
  from_bmi_value?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'BMI value must be at least 0' })
  @Max(50, { message: 'BMI value cannot exceed 50' })
  to_bmi_value?: number;

  @Field(() => BMI_CATEGORY, { nullable: true })
  @IsOptional()
  @IsEnum(BMI_CATEGORY)
  bmi_category?: BMI_CATEGORY;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  from_time?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  to_time?: Date;
}
