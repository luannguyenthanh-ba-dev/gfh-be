import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BmiEntity } from "./entities/bmi.entity";
import { BMI_CATEGORY } from "./bmi.const";
import { IBmiFilters } from "./bmi.interface";

@Injectable()
export class BmiService {
  private readonly logger = new Logger(BmiService.name);

  constructor(
    @InjectRepository(BmiEntity)
    private readonly bmiRepository: Repository<BmiEntity>
  ) {}

  query() {
    return this.bmiRepository.createQueryBuilder("bmi_records");
  }

  calculateBmi(weight: number, height: number): number {
    return weight / (height * height);
  }

  getBmiCategory(bmiValue: number): string {
    if (bmiValue < 18.5) return BMI_CATEGORY.UNDERWEIGHT;
    if (bmiValue < 25) return BMI_CATEGORY.NORMAL;
    if (bmiValue < 30) return BMI_CATEGORY.OVERWEIGHT;
    if (bmiValue < 35) return BMI_CATEGORY.OBESE;
    if (bmiValue < 40) return BMI_CATEGORY.OBESE_II;
    return BMI_CATEGORY.OBESE_III;
  }

  async create(data: {
    height: number;
    weight: number;
    owner_id: string;
  }): Promise<Partial<BmiEntity>> {
    try {
      this.logger.log(`Creating BMI record for user ${data.owner_id}`);

      // Create new BMI record
      // No need to calculate BMI value and category as they are generated columns
      const bmiRecord = this.bmiRepository.create({
        height: data.height,
        weight: data.weight,
        owner_id: data.owner_id,
      });

      // Save the record
      const result = await this.bmiRepository.save(bmiRecord);
      return result;
    } catch (error) {
      this.logger.error(
        `Error creating BMI record: ${error.message || "Unknown error"}`,
        error.stack
      );
      throw error;
    }
  }

  async findOne(filters: IBmiFilters) {
    const query = this.query();
    if (filters.id) query.andWhere("bmi_records.id = :id", { id: filters.id });
    if (filters.owner_id)
      query.andWhere("bmi_records.owner_id = :owner_id", {
        owner_id: filters.owner_id,
      });
    if (filters.bmi_value)
      query.andWhere("bmi_records.bmi_value = :bmi_value", {
        bmi_value: filters.bmi_value,
      });
    if (filters.bmi_category)
      query.andWhere("bmi_records.bmi_category = :bmi_category", {
        bmi_category: filters.bmi_category,
      });
    if (filters.from_time)
      query.andWhere("bmi_records.created_at >= :from_time", {
        from_time: filters.from_time,
      });
    if (filters.to_time)
      query.andWhere("bmi_records.created_at <= :to_time", {
        to_time: filters.to_time,
      });
    const result = await query.getOne();
    return result;
  }
}
