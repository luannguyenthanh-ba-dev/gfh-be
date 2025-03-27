import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BmiEntity } from "./entities/bmi.entity";
import { BMI_CATEGORY } from "./bmi.const";
import { IBmiFilters } from "./bmi.interface";
import { Oder } from "src/common/utils/constants.util";
import { paginate } from "src/common/utils/constants.util";
import { Between } from "typeorm";
import { BmiChartData } from "./models/bmi-chart.model";
import * as momentTz from 'moment-timezone';

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
    if (filters.bmi_category)
      query.andWhere("bmi_records.bmi_category = :bmi_category", {
        bmi_category: filters.bmi_category,
      });
    const result = await query.getOne();
    return result;
  }

  async paginate(
    filters: IBmiFilters,
    page: string | number = 1,
    limit: string | number = 10,
    order_by: string = "created_at",
    order: Oder = Oder.DESC
  ) {
    const query = this.query();
    if (filters.id) query.andWhere("bmi_records.id = :id", { id: filters.id });
    if (filters.owner_id)
      query.andWhere("bmi_records.owner_id = :owner_id", {
        owner_id: filters.owner_id,
      });
    if (filters.from_height)
      query.andWhere("bmi_records.height >= :from_height", {
        from_height: filters.from_height,
      });
    if (filters.to_height)
      query.andWhere("bmi_records.height <= :to_height", {
        to_height: filters.to_height,
      });
    if (filters.from_weight)
      query.andWhere("bmi_records.weight >= :from_weight", {
        from_weight: filters.from_weight,
      });
    if (filters.to_weight)
      query.andWhere("bmi_records.weight <= :to_weight", {
        to_weight: filters.to_weight,
      });
    if (filters.from_bmi_value)
      query.andWhere("bmi_records.bmi_value >= :from_bmi_value", {
        from_bmi_value: filters.from_bmi_value,
      });
    if (filters.to_bmi_value)
      query.andWhere("bmi_records.bmi_value <= :to_bmi_value", {
        to_bmi_value: filters.to_bmi_value,
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
    try {
      const { p, l } = paginate(page, limit);

      const [total, data] = await Promise.all([
        query.getCount(),
        query
          .orderBy(`bmi_records.${order_by}`, order)
          .skip((p - 1) * l)
          .take(l)
          .getMany(),
      ]);

      return { items: data || [], total, page: p, limit: l };
    } catch (error) {
      this.logger.log(
        `Paginate bmi records met error: ${error.message || "Unknown error"}`
      );
      throw new InternalServerErrorException(error.message || "Unknown error");
    }
  }

  async getChartData(
    owner_id: string,
    start_date: Date,
    end_date: Date,
    timezone: string = 'Asia/Ho_Chi_Minh'
  ): Promise<BmiChartData[]> {
    try {
      // Get all BMI records in the date range
      const records = await this.bmiRepository.find({
        where: {
          owner_id,
          created_at: Between(start_date, end_date)
        },
        order: {
          created_at: 'ASC'
        }
      });

      // Generate a complete date range from start to end
      const chartData: BmiChartData[] = [];
      const dateMap: Map<string, BmiEntity> = new Map();
      
      // Group by date string and keep only the latest record for each day
      records.forEach(record => {
        const dateStr = momentTz(record.created_at).tz(timezone).format('YYYY-MM-DD');
        // If we already have a record for this date, check if this one is newer
        if (dateMap.has(dateStr)) {
          const existingRecord = dateMap.get(dateStr);
          if (record.created_at > existingRecord.created_at) {
            dateMap.set(dateStr, record);
          }
        } else {
          dateMap.set(dateStr, record);
        }
      });
      
      // Create a continuous date range with all days using moment
      let current_moment = momentTz(start_date).tz(timezone);
      const end_moment = momentTz(end_date).tz(timezone);
      
      while (current_moment.isSameOrBefore(end_moment, 'day')) {
        const dateStr = current_moment.format('YYYY-MM-DD');
        const record = dateMap.get(dateStr);
        
        chartData.push({
          date: dateStr, // Format as "YYYY-MM-DD"
          bmi_value: record ? record.bmi_value : 0,
          bmi_category: record ? record.bmi_category : null
        });
        
        // Move to next day
        current_moment.add(1, 'day');
      }

      return chartData;
    } catch (error) {
      this.logger.error(
        `Error generating BMI chart data: ${error.message || 'Unknown error'}`,
        error.stack
      );
      throw error;
    }
  }
}
