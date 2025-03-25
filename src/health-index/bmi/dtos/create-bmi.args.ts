import { Field, Float, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

@ArgsType()
export class CreateBmiArgs {
  @Field(() => Float, { 
    description: 'Height in meters. Example: 1.75',
    nullable: false 
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.5, { message: 'Height must be at least 0.5 meters' })
  @Max(3, { message: 'Height cannot exceed 3 meters' })
  height: number;

  @Field(() => Float, { 
    description: 'Weight in kilograms. Example: 70.5',
    nullable: false 
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Weight must be at least 1 kg' })
  @Max(500, { message: 'Weight cannot exceed 500 kg' })
  weight: number;
} 