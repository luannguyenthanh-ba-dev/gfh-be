import { registerEnumType } from "@nestjs/graphql";

export enum BMI_CATEGORY {
  UNDERWEIGHT = "Underweight", // BMI < 18.5
  NORMAL = "Normal", // 18.5 <= BMI < 25
  OVERWEIGHT = "Overweight", // 25 <= BMI < 30
  OBESE = "Obese (Class I)", // 30 <= BMI < 35
  OBESE_II = "Obese (Class II)", // 35 <= BMI < 40
  OBESE_III = "Obese (Class III)", // BMI >= 40
}

registerEnumType(BMI_CATEGORY, {
  name: 'BMI_CATEGORY',
  description: 'BMI Category',
});
