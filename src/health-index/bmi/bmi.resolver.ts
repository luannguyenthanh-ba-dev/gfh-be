import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  UseGuards,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { BmiService } from "./bmi.service";
import { Bmi } from "./models/bmi.model";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { USER_ROLES, UserProfile } from "src/common/utils/constants.util";
import { Users } from "src/auth/users/models/users.model";
import { BMIChartArgs, CreateBmiArgs, PaginateBmiArgs } from "./dtos";
import { PaginatedBmi } from "./models/paginated-bmi.model";
import { BmiChartType } from "./bmi.const";
import { BmiChartData } from "./models/bmi-chart.model";
import * as momentTz from "moment-timezone";
import { Logger } from "@nestjs/common";
import { NotificationSvcService } from "src/external-services/notification-service/notification-svc.service";
import {
  APP_USERS_NOTIFICATION_SETTINGS_EVENTS,
  NOTIFICATION_TYPES,
} from "src/external-services/notification-service/notification-svc.const";
import { BmiEntity } from "./entities/bmi.entity";

@Resolver(() => Bmi)
export class BmiResolver {
  private readonly logger = new Logger(BmiResolver.name);

  constructor(
    private readonly bmiService: BmiService,
    private readonly notificationSvcService: NotificationSvcService
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Bmi)
  async createBmiRecord(
    @Args() createBmiArgs: CreateBmiArgs,
    @UserProfile() actionUser: Partial<Users>
  ) {
    // Get the current date
    const from_time = momentTz()
      .tz(createBmiArgs.timezone)
      .startOf("day")
      .toDate();

    const to_time = momentTz().tz(createBmiArgs.timezone).endOf("day").toDate();

    // Check if user already has a BMI record for today
    const existingRecord = await this.bmiService.findOne({
      owner_id: actionUser.id,
      from_time: from_time,
      to_time: to_time,
    });

    let bmiRecord: Partial<BmiEntity>;
    // If record exists, update it
    if (existingRecord) {
      this.logger.log(
        `Updating existing BMI record for user ${actionUser.email}`
      );
      bmiRecord = await this.bmiService.updateOne(existingRecord.id, {
        height: createBmiArgs.height,
        weight: createBmiArgs.weight,
      });
    } else {
      // If no record exists, create a new one
      this.logger.log(`Creating new BMI record for user ${actionUser.email}`);
      bmiRecord = await this.bmiService.create({
        ...createBmiArgs,
        owner_id: actionUser.id,
      });
    }

    if (bmiRecord) {
      this.notificationSvcService.sendAppUsersNotification({
        recipients: [
          {
            user_id: bmiRecord.owner_id,
            user_name: actionUser.first_name + " " + actionUser.last_name,
          },
        ],
        type: NOTIFICATION_TYPES.USER_NOTIFICATION,
        data: {
          event: APP_USERS_NOTIFICATION_SETTINGS_EVENTS.BMI_NOTIFICATION,
          bmi_value: bmiRecord.bmi_value,
          bmi_category: bmiRecord.bmi_category,
          height: bmiRecord.height,
          weight: bmiRecord.weight,
          created_at: bmiRecord.created_at,
        },
      });
    }

    return bmiRecord;
  }

  @UseGuards(AuthGuard)
  @Query(() => Bmi, { name: "getBmiById" })
  async getBmiById(
    @Args("id", { type: () => ID }) id: string,
    @UserProfile() actionUser: Partial<Users>
  ) {
    const bmiRecord = await this.bmiService.findOne({ id });

    if (!bmiRecord) {
      throw new NotFoundException("BMI record not found");
    }

    // Check if user has permission to view this record
    if (
      bmiRecord.owner_id !== actionUser.id &&
      actionUser.role !== USER_ROLES.ADMIN &&
      actionUser.role !== USER_ROLES.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        "You do not have permission to view this BMI record"
      );
    }

    return bmiRecord;
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedBmi, { name: "getMyBmiRecords" })
  async getMyBmiRecords(
    @Args() paginateArgs: PaginateBmiArgs,
    @UserProfile() actionUser: Partial<Users>
  ) {
    return this.bmiService.paginate(
      { owner_id: actionUser.id, ...paginateArgs },
      paginateArgs.page,
      paginateArgs.limit,
      paginateArgs.order_by,
      paginateArgs.order
    );
  }

  @UseGuards(AuthGuard)
  @Query(() => [BmiChartData], { name: "getMyBmiChart" })
  async getMyBmiChart(
    @Args() bmiChartArgs: BMIChartArgs,
    @UserProfile() actionUser: Partial<Users>
  ) {
    // Get timezone from args or use default
    const timezone = bmiChartArgs.timezone || "Asia/Ho_Chi_Minh";

    // Create moment objects with timezone
    let end_moment = momentTz().tz(timezone);
    let start_moment;

    // If custom date range is provided
    if (bmiChartArgs.from_date && bmiChartArgs.to_date) {
      end_moment = momentTz(bmiChartArgs.to_date).tz(timezone);
      start_moment = momentTz(bmiChartArgs.from_date).tz(timezone);
    }
    // Otherwise use predefined time ranges
    else if (bmiChartArgs.type) {
      switch (bmiChartArgs.type) {
        case BmiChartType.SEVEN_DAYS:
          start_moment = end_moment.clone().subtract(6, "days");
          break;
        case BmiChartType.THIRTY_DAYS:
          start_moment = end_moment.clone().subtract(29, "days");
          break;
        case BmiChartType.NINETY_DAYS:
          start_moment = end_moment.clone().subtract(89, "days");
          break;
        default:
          start_moment = end_moment.clone().subtract(6, "days");
      }
    } else {
      // Default to 7 days if no parameters provided
      start_moment = end_moment.clone().subtract(6, "days");
    }

    // Set time to start and end of day
    start_moment.startOf("day").tz(timezone);
    end_moment.endOf("day").tz(timezone);
    // Validate date range
    if (start_moment.isAfter(end_moment)) {
      throw new BadRequestException("Start date must be before end date");
    }
    if (end_moment.diff(start_moment, "days") > 30) {
      throw new BadRequestException("Date range must be less than 30 days");
    }

    // Convert to JavaScript Date objects
    const start_date = start_moment.toDate();
    const end_date = end_moment.toDate();

    return this.bmiService.getChartData(
      actionUser.id,
      start_date,
      end_date,
      timezone
    );
  }
}
