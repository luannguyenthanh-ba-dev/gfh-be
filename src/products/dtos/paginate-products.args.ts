import { ArgsType, Field, Float, ID } from "@nestjs/graphql";
import { PaginationArgs } from "src/common/utils/constants.util";
import { IsOptional, IsString, IsNumber } from "class-validator";
import { ProductCurrencies } from "../products.const";

@ArgsType()
export class PaginateProductsArgs extends PaginationArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  price?: number;

  @Field(() => ProductCurrencies, { nullable: true })
  @IsOptional()
  @IsString()
  currency?: ProductCurrencies;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  brand?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  from?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  to?: string;
}
