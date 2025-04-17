import { Injectable } from "@nestjs/common";
import { BMI_CATEGORY } from "src/health-index/bmi/bmi.const";

@Injectable()
export class RecommendationsService {
  constructor() {}

  async bmiRecommendations(
    height: number,
    weight: number,
    bmi: number,
    bmiCategory: BMI_CATEGORY
  ) {
    switch (bmiCategory) {
      case BMI_CATEGORY.UNDERWEIGHT:
        return "You are underweight. Please supplement with more protein, carbohydrates, and exercise to build muscle.";
      case BMI_CATEGORY.OVERWEIGHT:
        return "You are overweight. Please prioritize low-fat foods and increase physical activity.";
      case BMI_CATEGORY.OBESE:
        return "You are obese. Please apply a scientific diet and regular exercise.";
      case BMI_CATEGORY.OBESE_II:
        return "You are obese level 2. Please find a nutritionist to guide you on a safe weight loss plan.";
      case BMI_CATEGORY.OBESE_III:
        return "You are obese level 3 – dangerous. Please see a doctor and set up a strict diet immediately.";
      default:
        return "You are at a normal BMI. Please maintain a healthy lifestyle!";
    }
  }
}
